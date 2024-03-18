import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, List, ListItem, ListItemText, Menu, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStoreActions, useStoreState } from "../../hooks";
import { Helmet, HelmetProvider } from "react-helmet-async";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IMonitorGroupListByUser } from "../../interfaces/IMonitorGroupListByUser";
import { IUserMonitorGroup } from "../../interfaces/IUserMonitorGroup";
import UserService from "../../services/UserService";

interface IUsersProps { }

interface IHeaderCell {
    id: string;
    label: string;
    width?: string;
    sortable: boolean;
    align?: "left" | "center" | "right" | "justify" | "inherit"
}

const Users: FC<IUsersProps> = () => {
    const { t } = useTranslation("global");
    const { users, userMonitorGroups } = useStoreState((state) => state.user);
    const { monitorGroupListByUser, monitorGroupList } = useStoreState((state) => state.monitor);
    const { thunkGetAllUsers, thunkGetUserMonitorGroups } = useStoreActions((state) => state.user);
    const [open, setOpen] = useState(false);
    const [availableMonitorGroups, setAvailableMonitorGroups] = useState<IMonitorGroupListByUser[]>([]);
    const [assignedMonitorGroups, setAssignedMonitorGroups] = useState<IMonitorGroupListByUser[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [userId, setUserId] = useState<string>('');
    const openMenu = Boolean(anchorEl);
    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            await thunkGetAllUsers();
        };
        if (users.length == 0) {
            fetchData();
        }

    }, [users]);

    const handleClickOpen = (id: string) => {
        setOpen(true);
        setUserId(id);
        console.log(id, 'idxx', userMonitorGroups, 'userMonitorGroups', users, 'users')
        if (userMonitorGroups.length == 0 || !userMonitorGroups.some(s => s.userId != id)) {
            thunkGetUserMonitorGroups(id);
            setAssignedMonitorGroups(monitorGroupListByUser);
            setAvailableMonitorGroups(monitorGroupList.filter(x => !monitorGroupListByUser?.some(y => y.id === x.id)));
        }

        handleMenuClose();
    };
    const handleAddSelectItem = (id: number) => {
        let group = monitorGroupList.filter(s => s.id == id);
        assignedMonitorGroups.push(...group);
        setAssignedMonitorGroups(assignedMonitorGroups);
        setAvailableMonitorGroups(availableMonitorGroups.filter(x => x.id !== id));
    };
    const handleRemoveSelectItem = (id: number) => {
        let group = monitorGroupList.filter(s => s.id == id);
        availableMonitorGroups.push(...group);
        setAssignedMonitorGroups(assignedMonitorGroups.filter(x => x.id !== id));
        setAvailableMonitorGroups(availableMonitorGroups);
    };
    const handleSubmit = () => {
        console.log('submit', availableMonitorGroups, 'availableMonitorGroups', assignedMonitorGroups, 'assignedMonitorGroups');
        const convertedAssignedMonitorGroups: IUserMonitorGroup[] = assignedMonitorGroups.map(group => ({
            userId: userId,
            groupMonitorId: group.id
        }));
        UserService.updateMonitorGroup(convertedAssignedMonitorGroups);
        setOpen(false);

    }
    const handleClose = () => {
        setOpen(false);

    };
    const headerCells: readonly IHeaderCell[] = [
        {
            id: 'userName',
            label: t("users.userName"),
            sortable: false
        },
        {
            id: 'Email',
            label: t("users.email"),
            sortable: true
        },
        {
            id: 'isAdmin',
            label: t("users.isAdmin"),
            width: '220px',
            sortable: true
        },
        {
            id: 'Actions',
            label: t("users.actions"),
            sortable: true
        }
    ];

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>AlertHawk | {t("users.text")}</title>
                </Helmet>
            </HelmetProvider>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Card >
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <Table >
                                    <TableHead>
                                        <TableRow>
                                            {
                                                headerCells.map((headerCell: IHeaderCell) => (
                                                    <TableCell key={headerCell.id}>{headerCell.label} </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {users.length > 0 &&
                                            users.map((_user) => (
                                                <TableRow key={_user.id}>
                                                    <TableCell>{_user.username}</TableCell>
                                                    <TableCell>{_user.email}</TableCell>
                                                    <TableCell>{_user.isAdmin ? t("users.true") : t("users.false")}</TableCell>
                                                    <TableCell>
                                                        <IconButton aria-label="more" onClick={handleMenuClick}>
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                        <Menu
                                                            id="basic-menu"
                                                            anchorEl={anchorEl}
                                                            open={openMenu}
                                                            onClose={handleMenuClose}
                                                            MenuListProps={{
                                                                'aria-labelledby': 'basic-button',
                                                            }}
                                                        >
                                                            {/* <MenuItem onClick={handleClickOpen}>Edit</MenuItem> */}
                                                            <MenuItem onClick={() => handleClickOpen(_user.id!)}>Monitor Groups + {_user.id}</MenuItem>
                                                        </Menu>

                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        handleSubmit();
                    },
                    sx: { width: '500px', height: '500px' }
                }}
            >
                <DialogTitle>Manage Monitor Groups</DialogTitle>
                <DialogContent>
                    <Grid container spacing={4}>
                        <Grid item xs={12} >
                            <Card>
                                <CardContent sx={{
                                    height: '360px',
                                    overflowY: 'auto'
                                }}>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="top"

                                    >
                                        <div style={{ width: '40%', height: '100%' }}>
                                            <List key="availabe" sx={{ bgcolor: 'background.paper', paddingLeft: '10px' }}>
                                                {availableMonitorGroups != null && availableMonitorGroups.map((value: IMonitorGroupListByUser) => (
                                                    <ListItem
                                                        key={value.id}
                                                        disableGutters
                                                        onClick={() => handleAddSelectItem(value.id)}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        <ListItemText primary={`${value.name}`} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </div>
                                        <div>
                                            <ArrowBackIosIcon />
                                            <ArrowForwardIosIcon />
                                        </div>
                                        <div style={{ width: '40%', height: '100%' }}>
                                            <List key="assigned" sx={{ bgcolor: 'background.paper', paddingLeft: '10px' }}>
                                                {
                                                    assignedMonitorGroups != null && assignedMonitorGroups.map((value: IMonitorGroupListByUser) => (
                                                        <ListItem
                                                            key={value.id}
                                                            disableGutters
                                                            onClick={() => handleRemoveSelectItem(value.id)}
                                                            sx={{ cursor: 'pointer' }}
                                                        >
                                                            <ListItemText primary={` ${value.name}`} />
                                                        </ListItem>
                                                    ))}
                                            </List>
                                        </div>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Users;
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import Alert from '@mui/material/Alert';

import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStoreState } from "../../hooks";
import { Helmet, HelmetProvider } from "react-helmet-async";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IMonitorGroupListByUser } from "../../interfaces/IMonitorGroupListByUser";
import { IUserMonitorGroup } from "../../interfaces/IUserMonitorGroup";
import UserService from "../../services/UserService";
import NotFoundContent from "../../components/NotFoundContent/NotFoundContent";
import { IUser } from "../../interfaces/IUser";
interface IUsersProps { }

interface IHeaderCell {
    id: string;
    label: string;
    width?: string;
    sortable: boolean;
    align?: "left" | "center" | "right" | "justify" | "inherit";
}

const Users: FC<IUsersProps> = () => {
    const { t } = useTranslation("global");
    const [users, setUsers] = useState<IUser[]>([])
    const { monitorGroupList } = useStoreState((state) => state.monitor);
    const { user } = useStoreState((state) => state.user);
    const [open, setOpen] = useState(false);
    const [availableMonitorGroups, setAvailableMonitorGroups] = useState<IMonitorGroupListByUser[]>([]);
    const [assignedMonitorGroups, setAssignedMonitorGroups] = useState<IMonitorGroupListByUser[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [userId, setUserId] = useState<string>('');
    const openMenu = Boolean(anchorEl);
    const [openAlert, setOpenAlert] = useState(false);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            var response = await UserService.getAll();
            response = response.slice().sort((a, b) => {
                if (a.username! < b.username!) {
                    return -1;
                }
                if (a.username! > b.username!) {
                    return 1;
                }
                return 0;
            });
            setUsers(response);
        };
        if (users.length == 0) {
            if (user?.isAdmin) {
                fetchData();
            } else {
                setUsers([]);
            }
        }
    }, [users]);

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, userId: string) => {
        setAnchorEl(event.currentTarget);
        setUserId(userId);
    };

    const handleClickOpen = async () => {
        setOpen(true);
        var responseGroupListByUser = await UserService.getUserMonitorGroups(userId);
        var convertedResponseGroupListByUser = monitorGroupList.filter(x => responseGroupListByUser.map(y => y.groupMonitorId).includes(x.id));
        convertedResponseGroupListByUser = convertedResponseGroupListByUser.slice().sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        setAssignedMonitorGroups(convertedResponseGroupListByUser);
        var filtredList = monitorGroupList.filter(x => !convertedResponseGroupListByUser?.some(y => y.id === x.id));
        filtredList = filtredList.slice().sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        setAvailableMonitorGroups(filtredList);
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
    const handleSubmit = async () => {
        var convertedAssignedMonitorGroups: IUserMonitorGroup[] = [];
        if (assignedMonitorGroups.length == 0) {
            convertedAssignedMonitorGroups = [{
                userId: userId,
                groupMonitorId: 0
            }];
        }
        else {
            convertedAssignedMonitorGroups = assignedMonitorGroups.map(group => ({
                userId: userId,
                groupMonitorId: group.id
            }));
        }
        await UserService.updateMonitorGroup(convertedAssignedMonitorGroups);
        setOpenAlert(true);
        setOpen(false);

    }
    const handleClose = () => {
        setOpen(false);
        setAvailableMonitorGroups([]);
        setAssignedMonitorGroups([]);

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
            {!user?.isAdmin ? (
                <NotFoundContent />
            ) : (
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
                                                                <IconButton aria-label="more" onClick={(event) => handleMenuClick(event, _user.id!)}>
                                                                    <MoreVertIcon />
                                                                </IconButton>
                                                                <Menu
                                                                    id={`menu-${_user.id}`}
                                                                    anchorEl={anchorEl}
                                                                    open={openMenu}
                                                                    onClose={handleMenuClose}
                                                                    MenuListProps={{
                                                                        'aria-labelledby': 'basic-button',
                                                                    }}
                                                                >
                                                                    {/* <MenuItem onClick={handleClickOpen}>Edit</MenuItem> */}
                                                                    <MenuItem onClick={() => handleClickOpen()}>Monitor Groups</MenuItem>
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
                                                        {availableMonitorGroups.length > 0 ? (availableMonitorGroups.map((value: IMonitorGroupListByUser) => (
                                                            <ListItem
                                                                key={value.id}
                                                                disableGutters
                                                                onClick={() => handleAddSelectItem(value.id)}
                                                                sx={{ cursor: 'pointer' }}
                                                            >
                                                                <ListItemText primary={`${value.name}`} />
                                                            </ListItem>
                                                        ))) : (
                                                            <ListItem

                                                            >
                                                                <ListItemText >

                                                                    {t("users.noResultFoundFor")}

                                                                </ListItemText>
                                                            </ListItem>

                                                        )}
                                                    </List>
                                                </div>
                                                <div>
                                                    <ArrowBackIosIcon />
                                                    <ArrowForwardIosIcon />
                                                </div>
                                                <div style={{ width: '40%', height: '100%' }}>
                                                    <List key="assigned" sx={{ bgcolor: 'background.paper', paddingLeft: '10px' }}>
                                                        {assignedMonitorGroups.length > 0 ? (
                                                            assignedMonitorGroups.map((value: IMonitorGroupListByUser) => (
                                                                <ListItem
                                                                    key={value.id}
                                                                    disableGutters
                                                                    onClick={() => handleRemoveSelectItem(value.id)}
                                                                    sx={{ cursor: 'pointer' }}
                                                                >
                                                                    <ListItemText primary={` ${value.name}`} />
                                                                </ListItem>
                                                            ))) : (
                                                            <ListItem

                                                            >
                                                                <ListItemText >

                                                                    {t("users.noResultFoundFor")}

                                                                </ListItemText>
                                                            </ListItem>

                                                        )}
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
                    <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Alinhar à direita
                    >
                        <Alert onClose={handleCloseAlert} severity="success" elevation={6} variant="filled">
                            {t("users.monitorConfirmation")}
                        </Alert>
                    </Snackbar>
                </>
            )}
        </>
    );
};

export default Users;

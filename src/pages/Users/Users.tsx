import { Box, Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStoreActions, useStoreState } from "../../hooks";
import { Helmet, HelmetProvider } from "react-helmet-async";

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
    const { users } = useStoreState((state) => state.user);
    const { thunkGetAllUsers } = useStoreActions((state) => state.user);

    useEffect(() => {
        const fetchData = async () => {
            await thunkGetAllUsers();
        };
        if (users.length == 0) {
            fetchData();
        }
    }, [users]);


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
                                                    <TableCell>{headerCell.label} </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {users.length > 0 &&
                                            users.map((_user, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{_user.username}</TableCell>
                                                    <TableCell>{_user.email}</TableCell>
                                                    <TableCell>{_user.isAdmin ? t("users.true") : t("users.false")}</TableCell>
                                                    <TableCell>...</TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default Users;
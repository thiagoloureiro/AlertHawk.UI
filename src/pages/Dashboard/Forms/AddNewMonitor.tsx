import { Box, Typography, Card, CardContent, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IMonitorType } from '../../../interfaces/IMonitorType';
import MonitorTypeService from '../../../services/MonitorTypeService';
import HttpForm from './HttpForm';
import { useTranslation } from 'react-i18next';
import TcpForm from './TcpForm';

interface AddNewMonitorProps {
}

const AddNewMonitor: React.FC<AddNewMonitorProps> = () => {
    const [monitorTypes, setMonitorTypes] = useState<IMonitorType[]>([]);
    const [selectedMonitorType, setSelectedMonitorType] = useState<IMonitorType>({} as IMonitorType);
    const { t } = useTranslation("global");

    useEffect(() => {
        if (monitorTypes.length === 0) {
            MonitorTypeService.get().then((response) => {
                setMonitorTypes(response);
            });
        }
    }, [monitorTypes]);

    const handleMonitorTypeChange = (event: any) => {
        setSelectedMonitorType(monitorTypes.find((type) => type.id === event.target.value) as IMonitorType);
    };
    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Typography variant="h5" px={2} sx={{ marginBottom: "-15px" }}>
                    Add new monitor
                </Typography>
                <Card>
                    <CardContent>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-around",
                            }}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="monitorType-selection">
                                    Monitor Type
                                </InputLabel>
                                <Select
                                    labelId="monitorType-selection"
                                    id="monitorType-selection"
                                    value={selectedMonitorType.id}
                                    label={t("addNewMonitor.monitorType")}
                                    onChange={handleMonitorTypeChange}
                                >
                                    <MenuItem value="none" >Select</MenuItem>
                                    {monitorTypes.map((type, key) => (
                                        <MenuItem value={type.id} key={key}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        {
                            selectedMonitorType?.name === 'HTTP(s)' &&
                            <HttpForm monitorTypeId={selectedMonitorType?.id}/>
                        }
                        {
                            selectedMonitorType?.name === 'TCP Port' &&
                            <TcpForm monitorTypeId={selectedMonitorType?.id}/>
                        }
                      
                    </CardContent>

                </Card>

            </Box>

        </>
    );
};

export default AddNewMonitor;
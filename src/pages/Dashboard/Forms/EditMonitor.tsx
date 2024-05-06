import {
  Box,
  Typography,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { IMonitorType } from "../../../interfaces/IMonitorType";
import MonitorTypeService from "../../../services/MonitorTypeService";
import HttpForm from "./HttpForm";
import { useTranslation } from "react-i18next";
import TcpForm from "./TcpForm";

interface EditMonitorProps {
  setAddMonitorPanel: (val: boolean) => void;
}

const EditMonitor: React.FC<EditMonitorProps> = ({ setAddMonitorPanel }) => {
  const [monitorTypes, setMonitorTypes] = useState<IMonitorType[]>([]);
  const [selectedMonitorType, setSelectedMonitorType] = useState<IMonitorType>({
    id: 0,
  } as IMonitorType);
  const { t } = useTranslation("global");

  useEffect(() => {
    fetchMonitorTypes();
  }, [monitorTypes]);

  const fetchMonitorTypes = async () => {
    if (monitorTypes.length === 0) {
      await MonitorTypeService.get().then((response) => {
        setMonitorTypes(response);
      });
    }
  };
  const handleMonitorTypeChange = (event: any) => {
    setSelectedMonitorType(
      monitorTypes.find(
        (type) => type.id === event.target.value
      ) as IMonitorType
    );
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
                <InputLabel id="monitorType-selection">Monitor Type</InputLabel>
                <Select
                  labelId="monitorType-selection"
                  id="monitorType-selection"
                  value={selectedMonitorType.id}
                  label={t("addNewMonitor.monitorType")}
                  onChange={handleMonitorTypeChange}
                >
                  {monitorTypes.map((type, key) => (
                    <MenuItem value={type.id} key={key}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {selectedMonitorType?.name === "HTTP(s)" && (
              <HttpForm
                monitorTypeId={selectedMonitorType?.id}
                setAddMonitorPanel={setAddMonitorPanel}
              />
            )}
            {selectedMonitorType?.name === "TCP Port" && (
              <TcpForm
                monitorTypeId={selectedMonitorType?.id}
                setAddMonitorPanel={setAddMonitorPanel}
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default EditMonitor;

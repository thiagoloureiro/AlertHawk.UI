import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import getTheme from "../../../../theme";
import { useStoreActions, useStoreState } from "../../../../hooks";
import momentTZ from "moment-timezone";
import { grey } from "@mui/material/colors";
import { showSnackbar } from "../../../../utils/snackbarHelper";
import { useTranslation } from "react-i18next";

interface IGeneralProps {}

const options = momentTZ.tz.names().map((timezone) => {
  const offset = momentTZ.tz(timezone).format("Z");
  return {
    timezone,
    label: `${timezone} (UTC${offset})`,
  };
});

const languageOptions = [
  { code: "zh-CN", text: "中国人" },
  { code: "de-DE", text: "Deutsch" },
  { code: "en-US", text: "English" },
  { code: "fr-FR", text: "Française" },
  { code: "fi-FI", text: "Suomalainen" },
  { code: "it-IT", text: "Italiano" },
  { code: "jp-JP", text: "日本語" },
  { code: "ko-KR", text: "한국인" },
  { code: "in-HI", text: "हिन्दी" },
  { code: "pl-PL", text: "Polski" },
  { code: "pt-BR", text: "Português (Brasil)" },
  { code: "es-ES", text: "Español" },
  { code: "ru-RU", text: "Русский" },
  { code: "tr-TR", text: "Türkçe" },
  { code: "uk-UA", text: "Українська" },
  { code: "em-EM", text: "😀📅👌🔡👁️‍🗨️" }
];

const dateTimeFormatOptions = [
  { value: "YYYY-MM-DD HH:mm", label: "2024-03-21 15:30" },
  { value: "DD/MM/YYYY HH:mm", label: "21/03/2024 15:30" },
  { value: "MM/DD/YYYY hh:mm A", label: "03/21/2024 03:30 PM" },
  { value: "DD.MM.YYYY HH:mm", label: "21.03.2024 15:30" },
  { value: "MMMM DD, YYYY HH:mm", label: "March 21, 2024 15:30" },
];

const General: FC<IGeneralProps> = () => {
  const { t, i18n } = useTranslation("global");

  const { isDarkMode, selectedDisplayTimezone, dateTimeFormat } = useStoreState(
    (state) => state.app
  );
  const { setSelectedDisplayTimezone, setIsDarkMode, setDateTimeFormat } = useStoreActions(
    (action) => action.app
  );

  const theme = getTheme(isDarkMode ? "dark" : "light");

  const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const [value, setValue] = useState<any>(() => {
    return (
      options.find((opt) => opt.timezone === selectedDisplayTimezone) || null
    );
  });

  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (!selectedDisplayTimezone) {
      const guessedTimezone = momentTZ.tz.guess();
      setSelectedDisplayTimezone(guessedTimezone);
      setValue(options.find((opt) => opt.timezone === guessedTimezone));
    } else {
      setValue(
        options.find((opt) => opt.timezone === selectedDisplayTimezone) || null
      );
    }
  }, [selectedDisplayTimezone, setSelectedDisplayTimezone]);

  const handleAutocompleteChange = (_: any, newValue: any) => {
    setValue(newValue);
    if (newValue !== null) {
      setSelectedDisplayTimezone(newValue.timezone);
    } else {
      setSelectedDisplayTimezone("");
    }
    showSnackbar(
      t("settings.general.timezoneSettingsHaveBeenChanged"),
      "success"
    );
  };

  const isOptionEqualToValue = (option: any, value: any) => {
    return option.timezone === value.timezone;
  };

  const handleThemeChange = (
    _: React.MouseEvent<HTMLElement>,
    val: boolean | null
  ) => {
    if (val !== null) {
      setIsDarkMode(val);
      if (val) {
        showSnackbar(t("settings.general.darkThemeHasBeenEnabled"), "success");
      } else {
        showSnackbar(t("settings.general.lightThemeHasBeenEnabled"), "success");
      }
    }
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const languageCode = event.target.value;
    i18n.changeLanguage(languageCode);
    showSnackbar(
      t("settings.general.applicationLanguageHasBeenChanged"),
      "success"
    );
  };

  const handleDateFormatChange = (event: SelectChangeEvent<string>) => {
    const format = event.target.value;
    setDateTimeFormat(format);
    showSnackbar(
      t("settings.general.dateFormatHasBeenChanged"),
      "success"
    );
  };

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="start"
      spacing={1}
      width="100%"
    >
      <Typography variant="h6" sx={{ pb: 2 }}>
        {t("settings.general.text")}
      </Typography>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="start"
        spacing={5}
        style={!isMediumScreen ? { width: "50%" } : { width: "100%" }}
      >
        <FormControl fullWidth>
          <InputLabel id="language-selection">
            {t("settings.general.language")}
          </InputLabel>
          <Select
            labelId="language-selection"
            id="language-selection"
            value={i18n.language}
            label={t("settings.general.language")}
            onChange={handleLanguageChange}
          >
            {languageOptions.map((language, key) => (
              <MenuItem value={language.code} key={key}>
                {language.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="date-format-selection">
            {t("settings.general.dateTimeFormat")}
          </InputLabel>
          <Select
            labelId="date-format-selection"
            id="date-format-selection"
            value={dateTimeFormat || dateTimeFormatOptions[0].value}
            label={t("settings.general.dateTimeFormat")}
            onChange={handleDateFormatChange}
          >
            {dateTimeFormatOptions.map((format, key) => (
              <MenuItem value={format.value} key={key}>
                {format.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Autocomplete
          disableClearable
          fullWidth
          value={value}
          onChange={handleAutocompleteChange}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
          }}
          options={options}
          isOptionEqualToValue={isOptionEqualToValue}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("settings.general.displayTimezone")}
            />
          )}
        />

        <Box sx={{ width: "100%" }}>
          <Typography
            variant="body1"
            color={isDarkMode ? grey[300] : grey[700]}
            sx={{ mb: 1 }}
          >
            {t("settings.general.theme")}
          </Typography>
          <ToggleButtonGroup
            color="primary"
            value={isDarkMode}
            exclusive
            onChange={handleThemeChange}
            aria-label="Theme"
            fullWidth
          >
            <ToggleButton sx={{ width: "50%" }} value={false}>
              {t("settings.general.light")}
            </ToggleButton>
            <ToggleButton sx={{ width: "50%" }} value={true}>
              {t("settings.general.dark")}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Stack>
    </Stack>
  );
};

export default General;

import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
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
  { code: "zh-CN", text: "Chinese" },
  { code: "de-DE", text: "Deutsch" },
  { code: "en-US", text: "English" },
  { code: "it-IT", text: "Italian" },
  { code: "jp-JP", text: "Japanese" },
  { code: "ko-KR", text: "Korean" },
  { code: "pl-PL", text: "Polski" },
  { code: "pt-BR", text: "Português (Brasil)" },
  { code: "es-ES", text: "Spanish" },
  { code: "tr-TR", text: "Türkçe" }
];

const General: FC<IGeneralProps> = () => {
  const { t, i18n } = useTranslation("global");

  const { isDarkMode, selectedDisplayTimezone, isSearchEngineIndexingAllowed } =
    useStoreState((state) => state.app);
  const {
    setSelectedDisplayTimezone,
    setIsSearchEngineIndexingAllowed,
    setIsDarkMode,
  } = useStoreActions((action) => action.app);

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

  const handleSearchEngineRadioButtonChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val: string = event.target.value;

    setIsSearchEngineIndexingAllowed(val === "true" ? true : false);

    if (val === "true") {
      showSnackbar(t("settings.general.indexingHasBeenEnabled"), "success");
    } else {
      showSnackbar(t("settings.general.indexingHasBeenDisabled"), "warning");
    }
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
        <FormControl>
          <FormLabel
            id="search-engine-indexing"
            sx={
              isDarkMode
                ? { mb: 1, color: grey[300] }
                : { mb: 1, color: grey[700] }
            }
          >
            {t("settings.general.searchEngineVisibility")}
          </FormLabel>
          <RadioGroup
            aria-labelledby="search-engine-indexing"
            name="search-engine-indexing"
            value={isSearchEngineIndexingAllowed}
            onChange={handleSearchEngineRadioButtonChange}
          >
            <FormControlLabel
              value={true}
              control={<Radio />}
              label={t("settings.general.allowSearchEngineIndexing")}
            />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label={t("settings.general.preventSearchEnginesFromIndexing")}
            />
          </RadioGroup>
        </FormControl>
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

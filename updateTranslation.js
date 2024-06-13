const fs = require('fs');
const path = require('path');

const updateJsonValue = (obj, keyPath, value) => {
  const keys = keyPath.split('.');
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
  }
};

const processJsonFile = (filePath, keyPath, value) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error to open file ${filePath}:`, err);
      return;
    }

    let jsonContent;
    try {
      jsonContent = JSON.parse(data);
    } catch (parseError) {
      console.error(`Error to parse json file ${filePath}:`, parseError);
      return;
    }

    updateJsonValue(jsonContent, keyPath, value);

    fs.writeFile(filePath, JSON.stringify(jsonContent, null, 2), 'utf8', (writeError) => {
      if (writeError) {
        console.error(`Error to update file ${filePath}:`, writeError);
      } else {
        console.log(`file ${filePath} updated!`);
      }
    });
  });
};

const updateTranslations = (translations) => {
  translations.forEach(({ lang, keyPath, value }) => {
    const filePath = path.join(__dirname, 'src/locales', lang, 'global.json');
    processJsonFile(filePath, keyPath, value);
  });
};

const translations = [
  { lang: 'en-US', keyPath: 'monitorGroups.editMonitorGroup', value: 'Edit Monitor Group' },
  { lang: 'de-DE', keyPath: 'monitorGroups.editMonitorGroup', value: 'Monitorgruppe bearbeiten' },
  { lang: 'tr-TR', keyPath: 'monitorGroups.editMonitorGroup', value: 'Monitör Grubunu Düzenle' },
  { lang: 'pl-PL', keyPath: 'monitorGroups.editMonitorGroup', value: 'Edytuj Grupę Monitorów' },
  { lang: 'pt-BR', keyPath: 'monitorGroups.editMonitorGroup', value: 'Editar Grupo de Monitoramento' },
  { lang: 'es-ES', keyPath: 'monitorGroups.editMonitorGroup', value: 'Editar Grupo de Monitorización' },
  { lang: 'it-IT', keyPath: 'monitorGroups.editMonitorGroup', value: 'Modifica Gruppo di Monitoraggio' },
  { lang: 'ko-KR', keyPath: 'monitorGroups.editMonitorGroup', value: '모니터 그룹 수정' },
  { lang: 'jp-JP', keyPath: 'monitorGroups.editMonitorGroup', value: 'モニターグループ編集' },
  { lang: 'zh-CN', keyPath: 'monitorGroups.editMonitorGroup', value: '编辑监控组' },
  { lang: 'ru-RU', keyPath: 'monitorGroups.editMonitorGroup', value: 'Редактировать Группу Мониторов' },
  { lang: 'uk-UA', keyPath: 'monitorGroups.editMonitorGroup', value: 'Редагувати Групу Моніторів' },
  { lang: 'em-EM', keyPath: 'monitorGroups.editMonitorGroup', value: '📝📊👥' },
  { lang: 'in-HI', keyPath: 'monitorGroups.editMonitorGroup', value: 'मॉनीटर समूह संपादित करें' },
  { lang: 'fr-FR', keyPath: 'monitorGroups.editMonitorGroup', value: 'Modifier le Groupe de Surveillance' },
  { lang: 'fi-FI', keyPath: 'monitorGroups.editMonitorGroup', value: 'Muokkaa Monitoriryhmää' }
];

// Exemplo de execução do script
updateTranslations(translations);



// Executar a função principal
updateTranslations(translations);

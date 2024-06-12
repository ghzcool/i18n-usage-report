# i18n-usage-report
find usage of translations and not used values

## Arguments:

-P for project path

-T for translation file path

-S if single quotes are used in code

## Env variables

PROJECT_PATH for project path

TRANSLATION_PATH for translation file path

SINGLE_QUOTE if single quotes are used in code

## Usage example

```
npx i18n-usage-report -P ./project_path/src -T ./project_path/src/locales/en.json
```

Script will get keys from translation file, check usage of these keys in project files and report unused keys.

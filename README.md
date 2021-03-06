# Command Line File Manager (NodeJS)

Никаких внешних зависимостей не требуется.
Программа запускается запуском npm-скрипта следующим образом:

```bash
npm run start -- --username=your_username
```

Приятного пользования!

## Доступные команды:

- Базовые операции с файлами:
  - Прочитать файл и распечатать его содержимое в консоли:
  ```bash
  cat path_to_file
  ```
  - Создать пустой файл в рабочем каталоге:
  ```bash
  add new_file_name
  ```
  - Переименовать файл:
  ```bash
  rn path_to_file new_filename
  ```
  - Копировать файл:
  ```bash
  cp path_to_file path_to_new_directory
  ```
  - Переместить файл (то же самое что и копировать, но исходный файл удаляется):
  ```bash
  mv path_to_file path_to_new_directory
  ```
  - Удалить файл:
  ```bash
  rm path_to_file
  ```
- Получение информации о текущей операционной системе (информация будет распечатана в консоли):
  - Получить символ окончания строки:
  ```bash
  os --EOL
  ```
  - Получить информацию о ЦП текущего устройства (Модель, количество ядер, тактовая частота в ГГЦ):
  ```bash
  os --cpus
  ```
  - Получить домашнюю директорию:
  ```bash
  os --homedir
  ```
  - Получить имя текущего системного пользователя:
  ```bash
  os --username
  ```
  - Получить архитекуру ЦП:
  ```bash
  os --architecture
  ```
- Вычисление хэша:
  - Вычислить хэш файла и распечатать его в консоль:
  ```bash
  hash path_to_file
  ```
- Архивирование и разархивирование файлов:
  - Архивировать файл, используя алгоритм Бротли:
  ```bash
  compress path_to_file path_to_destination
  ```
  - Рахархивировать файл, используя алгоритм Бротли
  ```bash
  decompress path_to_file path_to_destination
  ```
- Дополнительные команды:
  - Получить список доступных команд:
  ```bash
  help
  ```

## Особенности работы приложения:

- Если не указать Username при запуске, приложение запустится и в качестве имени пользователя будет установлено 'Anonymous User'.
- При указании названия или пути к папке/файлу можно использовать как заглавные так и строчные буквы (как и в стандартной консоли windows).
- При необходимости использования пути содержащего в себе символы пробела оберните его в одинарные или двойные кавычки. Прим: `cd "Рабочий Стол"`.
- Команды принимают как разделитель в виде "/" так и "\\" (как и в стандартной консоли windows), возможно даже скомбинировать их в одном пути если хочется немного извращений, однако рекомендую использовать тот разделитель который используется вашей системой.
- Часть команд принимает как абсолютные так и относительные пути (см. Описание работы команд ниже). Если не хочется читать, то используйте тот вид путей который был указан в задании, ознакомьтесь лишь с информацией по `compress` и `decompress`. Также зачастую в случае ошибки в консоли выведется подсказка, которая объяснит что было сделано не так.

## Особенности работы функций

Основные операции с файлами:
`cat` - `path_to_file` может быть как абсолютным так и относительным.
`add` - `new_file_name` должно быть именно именем файла, а путем к нему.
`rn` - `path_to_file` может быть как абсолютным так и относительным. `new_file_name` должно быть именно именем нового файла, а путем к нему.
`cp` - `path_to_file` и `path_to_new_directory` могут быть как абсолютными так и относительными.
`mv` - `path_to_file` и `path_to_new_directory` могут быть как абсолютными так и относительными.
`rm` - `path_to_file` может быть как абсолютным так и относительным.

Расчет хэша:
`hash` - `path_to_file` может быть как абсолютным так и относительным.

Операции сжатия и распаковки:
`compress` - `path_to_file` может быть как относительным так и абсолютным. `path_to_destination` - обязательно должно быть абсолютным путем, который заканчивается именем сжатого файла с расширением `br`. Примеры:

```bash
compress C:\User\fileToCompress.txt C:\User\compressedFile.br
compress fileToCompress.txt C:\User\compressedFile.br
```

`decompress` - `path_to_file` может быть как относительным так и абсолютным. `path_to_destination` - обязательно должно быть абсолютным путем, который заканчивается именем разархивированного файла с необходимым расширением. Примеры:

```bash
decompress C:\User\compressedFile.br C:\User\decompressedFile.txt
decompress compressedFile.br C:\User\decompressedFile.txt
```

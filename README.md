Config parser

Задача - создать парсер файлов конфигурации частного случая.
Необходимо разработать примитивный API на nodejs, который предоставляет интерфейс для загрузки файла. Получив файл на бекенде, выбирает все фронтенды с записью ssl и все acl'ы полных доменных имен, привязанных к этому фронтенду.

Запуск демки.

Терминал №1:
$ node ./congig-parser-server/server.js

Терминал №2:
$ node ./samples/demo.js
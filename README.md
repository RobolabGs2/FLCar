# FLCar
Проект для курса неклассических логик

## Разработка

### Требуются
+ [node.js](https://nodejs.org/en/download/)
+ yarn: `npm install -g yarn`

### После клонирования
Подтягиваем зависимости `yarn install`

### Сборка
+ `yarn webpack` - компилирует проект и кладёт всё в папку `static`
+ `yarn dev` - запускает сервер, файл-вотчер и браузер. При изменении файла он сразу перекомпилируется, а страница в браузере обновится. Если нужна только часть поведения, можно взять команду из `package.json` и добавить вариант под свой вкус.
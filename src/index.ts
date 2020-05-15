import {Drawer} from "./graphics/drawer";
import {downloadBitmap, fileAsURL} from "./image/helpers";
import {Simulator} from "./simulator";


const canvas = document.getElementById('main') as HTMLCanvasElement;
const drawer = new Drawer(canvas);
const simulator = new Simulator(drawer);

Promise.all(["map.png", "small_car.png"].map(src => downloadBitmap(`./resources/${src}`)))
    .then(function ([map, car]) {
        const settings = {map, car};
        simulator.startSimulation(settings);
        const form = document.getElementById("settings") as HTMLFormElement;
        form.addEventListener("submit", ev => {
            const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
            const maybeImg = fileInput?.files?.item(0);
            if (maybeImg) {
                fileAsURL(maybeImg).then(downloadBitmap).then(map => {
                    settings.map = map;
                    simulator.startSimulation(settings);
                })
            }
            ev.preventDefault()
        });
    });


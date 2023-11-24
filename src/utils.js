import { load } from 'opentype.js';
import * as THREE from 'three';

const width = 72;
const height = 72;

export function getPathRadius(str, radius) {
    return new Promise(
        (resole, reject) => {
            let font; // 用于存储加载的字体
            const fontPath = '/demo.ttf'; // 替换为你的字体文件路径
            load(fontPath, function (err, loadedFont) {
                if (err) {
                    console.error('Font could not be loaded: ' + err);
                    reject(err)
                } else {
                    font = loadedFont;
                    // 当字体加载后，获取字符路径
                    const path = font.getPath(str, 0, 0, 72); // 调整位置和字体大小
                    const commands = path.commands; // 获取路径命令
                    // 处理这些命令以获取坐标
                    const points = processCommands(commands)

                    const Spheres = mapToSphere(points, radius)

                    resole(Spheres)
                }
            });
        }
    )
}


function processCommands(commands) {
    const points = [];
    commands.forEach(cmd => {
        if (cmd.type === 'L' || cmd.type === 'M') {
            points.push(new THREE.Vector2(cmd.x, cmd.y));
        }
        // 根据需要处理其他命令类型
    });
    return points;
}

function mapToSphere(points, radius) {
    const spherePoints = [];
    points.forEach(point => {
        // 假设 point 是二维的，需要转换为球面上的三维点
        // 这里是简化的映射逻辑，可能需要根据你的需求调整
        const phi = (point.x / width) * Math.PI * 2;
        const theta = (point.y / height) * Math.PI;
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);

        spherePoints.push(new THREE.Vector3(x, y, z));
    });
    return spherePoints;
}
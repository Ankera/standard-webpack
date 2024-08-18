import styles from '@/index.css';

console.log('styles', styles)

const div = document.createElement('div')

div.className = styles?.someClass || 'wrap';

div.innerHTML = "hello world 8888 999" + process.env.NODE_ENV;

const root = document.getElementById("root")
root.append(div)

// console.log(__webpack_public_path__);
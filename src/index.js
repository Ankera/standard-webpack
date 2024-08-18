import isarray from './isarray';
import _ from 'lodash';
import styles from '@/index.css';

console.log('styles', styles)
console.log('isarray', isarray([]))

const div = document.createElement('div')

div.className = styles?.someClass || 'wrap';

div.innerHTML = "hello world 8888 999" + process.env.NODE_ENV + "==>" + "__insert_blade__";

const root = document.getElementById("root")
root.append(div)

// console.log(__webpack_public_path__);

fetch("/user/userInfo", (res) => {
  console.log("res========", res)
})
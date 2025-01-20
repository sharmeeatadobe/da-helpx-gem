export default (block) => {
  const anchors = [];
  const list = block.querySelector('ul');
  [...list.children].forEach(child => {
    const anchorTag = child.querySelector('a');
    anchorTag && anchors.push(anchorTag);
  })
  const ul = document.createElement('ul');
  anchors.forEach(a => {
    const li = document.createElement('li');
    li.appendChild(a);
    ul.appendChild(li);
  })
  block.replaceChildren(ul);
};

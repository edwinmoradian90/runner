const getSprite = (filename) => {
  const sprite = new Image();
  sprite.src = `../assets/sprites/${filename}`;

  return sprite;
};

const spriteList = [
  {
    name: 'ship',
    filename: 'Fighter3.png',
  },
  {
    name: 'missile',
    filename: 'beams.png',
  },
  {
    name: 'rapidFireBeams',
    filename: 'beamRapid.png',
  },
  {
    name: 'asteroidBig',
    filename: 'asteriod-big.png',
  },
  {
    name: 'heart',
    filename: 'heart.png',
  },
];

export const sprites = spriteList.reduce((acc, sprite) => {
  acc[sprite.name] = getSprite(sprite.filename);
  return acc;
}, {});

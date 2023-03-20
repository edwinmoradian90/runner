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

const getSprite = (filename) => {
  const sprite = new Image();
  sprite.src = `../assets/sprites/${filename}`;

  return sprite;
};

export const sprites = {};

spriteList.forEach(
  (sprite) => (sprites[sprite.name] = getSprite(sprite.filename))
);

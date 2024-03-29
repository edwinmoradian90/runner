export const random = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

export const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const Colors = {
  Green: 'green',
  Orange: 'orange',
  Red: 'red',
  Yellow: 'yellow',
};

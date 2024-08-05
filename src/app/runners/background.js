addEventListener('myCustomEvent', (resolve, reject, args) => {
  console.log('myCustomEvent', args);

  resolve();
});

// Web Worker for complex calculations (e.g. animation paths, pre-fetching)
self.onmessage = function(e) {
  if (e.data.type === 'init') {
    // Simulate heavy calculation for 60fps pathing or dummy data
    let result = 0;
    for(let i=0; i<1000000; i++) {
      result += Math.sin(i);
    }
    self.postMessage({ type: 'ready', payload: result });
  }
};

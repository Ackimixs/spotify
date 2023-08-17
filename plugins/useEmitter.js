import mitt from "mitt";

export default defineNuxtPlugin(() => {
  const emitter = mitt();

  return {
    provide: {
      musicEvent: {
        $on: emitter.on,
        $emit: emitter.emit,
      },
    },
  };
});

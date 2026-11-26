(() => {
  const trigger = document.querySelector("[data-game-trigger]");
  const dialog = document.querySelector("#secret-game");
  const screen = dialog?.querySelector("[data-game-screen]");
  if (!trigger || !dialog || !screen) return;

  let resizeObserver;
  const resizeGame = () => {
    const frame = screen.querySelector("iframe");
    if (frame) frame.style.transform = `scale(${screen.getBoundingClientRect().width / 1442})`;
  };

  trigger.addEventListener("click", () => {
    if (dialog.open) return;

    dialog.showModal();
    document.body.classList.add("game-open");

    // Newgrounds disallows external frames. This is the creator's official
    // playable itch.io embed of the same game, loaded only after discovery.
    const frame = document.createElement("iframe");
    frame.title = "360 Degrees by Stepford";
    frame.allow = "autoplay; fullscreen; gamepad";
    frame.allowFullscreen = true;
    // GameMaker uses a fixed 1440 x 810 canvas. Preserve that viewport plus
    // itch.io's 1px borders and 20px footer, then scale the complete player.
    frame.width = "1442";
    frame.height = "831";
    frame.src = "https://itch.io/embed-upload/5422280?color=1c1d18";
    screen.replaceChildren(frame);
    resizeGame();
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(resizeGame);
      resizeObserver.observe(screen);
    } else {
      window.addEventListener("resize", resizeGame);
    }
  });

  dialog.querySelector("[data-game-close]").addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });

  dialog.addEventListener("close", () => {
    // Destroy the player so its music and game loop stop when dismissed.
    resizeObserver?.disconnect();
    window.removeEventListener("resize", resizeGame);
    screen.replaceChildren();
    document.body.classList.remove("game-open");
    trigger.focus({ preventScroll: true });
  });

  window.addEventListener("pagehide", () => {
    if (dialog.open) dialog.close();
  });
})();

import { ITile } from "./types";
import classes from "./tile.module.scss";

interface IProps extends ITile {
  updateGame: (id: number, setFlag?: boolean) => void;
  done: boolean;
}

const Tile = ({
  id,
  mine,
  minesAround,
  showContent,
  updateGame,
  done,
  flag,
}: IProps) => {
  const show = done || showContent;

  function handleFlag(e: any) {
    e.preventDefault();
    updateGame(id, true);
  }

  return (
    <button
      disabled={show}
      type="button"
      className={`${classes.root} ${show ? classes["show-content"] : ""}`}
      onClick={() => updateGame(id, false)}
      onContextMenu={handleFlag}
    >
      {flag ? "⛳️" : ""}
      {show && mine ? "💣" : ""}
      {!flag && showContent && !done && !mine && minesAround ? minesAround : ""}
    </button>
  );
};

export default Tile;

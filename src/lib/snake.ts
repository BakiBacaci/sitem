export type Dir = 'up' | 'down' | 'left' | 'right';
export type Pt = { x: number; y: number };
export type SnakeState = {
  cols: number;
  rows: number;
  body: Pt[];
  dir: Dir;
  queue: Dir[];
  food: Pt;
  score: number;
  status: 'playing' | 'over';
};

const DELTA: Record<Dir, Pt> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };
const MAX_QUEUE = 2;

function placeFood(cols: number, rows: number, body: Pt[], rng: () => number): Pt {
  const taken = new Set(body.map((p) => `${p.x},${p.y}`));
  const empty: Pt[] = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (!taken.has(`${x},${y}`)) empty.push({ x, y });
  return empty[Math.min(empty.length - 1, Math.floor(rng() * empty.length))] ?? { x: -1, y: -1 };
}

export function createGame(cols: number, rows: number, rng: () => number = Math.random): SnakeState {
  const hx = Math.floor(cols / 2), hy = Math.floor(rows / 2);
  const body = [{ x: hx, y: hy }, { x: hx - 1, y: hy }, { x: hx - 2, y: hy }];
  return { cols, rows, body, dir: 'right', queue: [], food: placeFood(cols, rows, body, rng), score: 0, status: 'playing' };
}

/** Yönü kuyruğa ekler; bir önceki yönün tersiyse ya da kuyruk doluysa yok sayar. */
export function turn(s: SnakeState, d: Dir): SnakeState {
  const last = s.queue.at(-1) ?? s.dir;
  if (s.queue.length >= MAX_QUEUE || d === last || d === OPPOSITE[last]) return s;
  return { ...s, queue: [...s.queue, d] };
}

export function step(s: SnakeState, rng: () => number = Math.random): SnakeState {
  if (s.status === 'over') return s;
  const [next, ...queue] = s.queue;
  const dir = next ?? s.dir;
  const head = { x: s.body[0].x + DELTA[dir].x, y: s.body[0].y + DELTA[dir].y };
  const eats = head.x === s.food.x && head.y === s.food.y;
  const rest = eats ? s.body : s.body.slice(0, -1);

  const hitsWall = head.x < 0 || head.y < 0 || head.x >= s.cols || head.y >= s.rows;
  const hitsSelf = rest.some((p) => p.x === head.x && p.y === head.y);
  if (hitsWall || hitsSelf) return { ...s, dir, queue, status: 'over' };

  const body = [head, ...rest];
  return {
    ...s,
    body,
    dir,
    queue,
    food: eats ? placeFood(s.cols, s.rows, body, rng) : s.food,
    score: s.score + (eats ? 1 : 0),
  };
}

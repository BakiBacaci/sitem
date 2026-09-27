import { describe, expect, it } from 'vitest';
import { createGame, step, turn, type SnakeState } from './snake';

const fixed = () => 0; // yem her zaman ilk boş hücreye

describe('yılan', () => {
  it('3 uzunlukta, sağa bakan, ortada başlar', () => {
    const s = createGame(20, 20, fixed);
    expect(s.body).toHaveLength(3);
    expect(s.dir).toBe('right');
    expect(s.body[0]).toEqual({ x: 10, y: 10 });
    expect(s.status).toBe('playing');
  });

  it('sağa giderken sola dönüş yok sayılır', () => {
    const s = step(turn(createGame(20, 20, fixed), 'left'), fixed);
    expect(s.body[0]).toEqual({ x: 11, y: 10 });
    expect(s.status).toBe('playing');
  });

  it('aynı tick içinde yukarı sonra sol: kendi üstüne dönmez', () => {
    let s = createGame(20, 20, fixed);
    s = turn(turn(s, 'up'), 'left');
    s = step(s, fixed);
    expect(s.body[0]).toEqual({ x: 10, y: 9 });
    s = step(s, fixed);
    expect(s.body[0]).toEqual({ x: 9, y: 9 });
    expect(s.status).toBe('playing');
  });

  it('kuyruk en fazla 2 yön tutar', () => {
    const s = turn(turn(turn(createGame(20, 20, fixed), 'up'), 'left'), 'down');
    expect(s.queue).toEqual(['up', 'left']);
  });

  it('duvara çarpınca oyun biter', () => {
    let s: SnakeState = createGame(5, 5, fixed);
    for (let i = 0; i < 5; i++) s = step(s, fixed);
    expect(s.status).toBe('over');
  });

  it('yem yiyince büyür, skor artar, yeni yem gövdede değil', () => {
    let s = createGame(20, 20, fixed);
    s = { ...s, food: { x: 11, y: 10 } };
    s = step(s, fixed);
    expect(s.score).toBe(1);
    expect(s.body).toHaveLength(4);
    expect(s.body.some((p) => p.x === s.food.x && p.y === s.food.y)).toBe(false);
  });

  it('bitmiş oyunda step durumu değiştirmez', () => {
    const over = { ...createGame(5, 5, fixed), status: 'over' as const };
    expect(step(over, fixed)).toBe(over);
  });
});

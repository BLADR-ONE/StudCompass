let lockCount = 0;
let previousOverflow = '';

export function lock() {
  if (typeof document === 'undefined') {
    return;
  }

  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
  }

  lockCount += 1;
  document.body.style.overflow = 'hidden';
}

export function unlock() {
  if (typeof document === 'undefined' || lockCount === 0) {
    return;
  }

  lockCount -= 1;

  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
    previousOverflow = '';
  }
}

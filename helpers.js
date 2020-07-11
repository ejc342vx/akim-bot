getNoun = (number, one, two, five) => {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
      return five;
  }
  n %= 10;
  if (n === 1) {
      return one;
  }
  if (n >= 2 && n <= 4) {
      return two;
  }
  return five;
}

time = (seconds) => {
  if (seconds < 60) {
      return `${getNoun(seconds, 'прошла', 'прошло', 'прошло')} ${seconds} ${getNoun(seconds, 'секунда', 'секунды', 'секунд')} с последнего обсуждения Акима!`
  } else if (seconds < 3600) {
      const m = Math.floor(seconds / 60)
      return `${getNoun(m, 'прошла', 'прошло', 'прошло')} ${m} ${getNoun(m, 'минута', 'минуты', 'минут')} с последнего обсуждения Акима!`
  } else if (seconds >= 3600) {
      let h = seconds / 3600 ^ 0
      let m = (seconds - h * 3600) / 60 ^ 0
      return `${getNoun(h, 'прошел', 'прошло', 'прошло')} ${h} ${getNoun(h, 'час', 'часа', 'часов')} ${m} ${getNoun(m, 'минута', 'минуты', 'минут')} с последнего обсуждения Акима!`
  }
}

maxTime = (seconds) => {
  if (seconds < 60) {
      return `${seconds} ${getNoun(seconds, 'секунда', 'секунды', 'секунд')} - рекорд чата без обсуждения Акима`
  } else if (seconds < 3600) {
      const m = Math.floor(seconds / 60)
      return `${m} ${getNoun(m, 'минута', 'минуты', 'минут')} - рекорд чата без обсуждения Акима`
  } else if (seconds >= 3600) {
      let h = seconds / 3600 ^ 0
      let m = (seconds - h * 3600) / 60 ^ 0
      return `${h} ${getNoun(h, 'час', 'часа', 'часов')} ${m} ${getNoun(m, 'минута', 'минуты', 'минут')} - рекорд чата без обсуждения Акима`
  }
}

currentTime = (seconds) => {
  if (seconds < 60) {
      return `${getNoun(seconds, 'прошла', 'прошло', 'прошло')} ${seconds} ${getNoun(seconds, 'секунда', 'секунды', 'секунд')}`
  } else if (seconds < 3600) {
      const m = Math.floor(seconds / 60)
      return `${getNoun(seconds, 'прошла', 'прошло', 'прошло')} ${m} ${getNoun(m, 'минута', 'минуты', 'минут')}`
  } else if (seconds >= 3600) {
      let h = seconds / 3600 ^ 0
      let m = (seconds - h * 3600) / 60 ^ 0
      return `${getNoun(seconds, 'прошел', 'прошло', 'прошло')} ${h} ${getNoun(h, 'час', 'часа', 'часов')} ${m} ${getNoun(m, 'минута', 'минуты', 'минут')}`
  }
}

module.exports = {
  time: time,
  getNoun: getNoun,
  maxTime: maxTime,
  currentTime: currentTime
}
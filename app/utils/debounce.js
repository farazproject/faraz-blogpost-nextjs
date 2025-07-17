/**
 * Debounce function - delays execution until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @param {boolean} immediate - Execute immediately on first call
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait, immediate = false) {
  let timeout

  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func.apply(this, args)
  }
}

/**
 * Throttle function - limits execution to at most once per specified time period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit) {
  let inThrottle

  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Advanced debounce with cancel and flush methods
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @param {Object} options - Options object
 * @returns {Function} - Enhanced debounced function
 */
export function advancedDebounce(func, wait, options = {}) {
  const { leading = false, trailing = true, maxWait } = options
  let timeout
  let maxTimeout
  let result
  let lastCallTime
  let lastInvokeTime = 0
  let lastArgs
  let lastThis

  function invokeFunc(time) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function leadingEdge(time) {
    lastInvokeTime = time
    timeout = setTimeout(timerExpired, wait)
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxWait !== undefined ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    )
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    timeout = setTimeout(timerExpired, remainingWait(time))
  }

  function trailingEdge(time) {
    timeout = undefined

    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel() {
    if (timeout !== undefined) {
      clearTimeout(timeout)
    }
    if (maxTimeout !== undefined) {
      clearTimeout(maxTimeout)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timeout = undefined
  }

  function flush() {
    return timeout === undefined ? result : trailingEdge(Date.now())
  }

  function pending() {
    return timeout !== undefined
  }

  function debounced(...args) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timeout === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxWait !== undefined) {
        timeout = setTimeout(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timeout === undefined) {
      timeout = setTimeout(timerExpired, wait)
    }
    return result
  }

  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending

  return debounced
}

/**
 * Create a debounced search function
 * @param {Function} searchFunc - Search function to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {Function} - Debounced search function
 */
export function createDebouncedSearch(searchFunc, delay = 300) {
  return debounce(searchFunc, delay)
}

/**
 * Create a debounced save function
 * @param {Function} saveFunc - Save function to debounce
 * @param {number} delay - Delay in milliseconds (default: 1000)
 * @returns {Function} - Debounced save function
 */
export function createDebouncedSave(saveFunc, delay = 1000) {
  return debounce(saveFunc, delay)
}

/**
 * Create a throttled scroll handler
 * @param {Function} scrollFunc - Scroll function to throttle
 * @param {number} limit - Time limit in milliseconds (default: 100)
 * @returns {Function} - Throttled scroll function
 */
export function createThrottledScroll(scrollFunc, limit = 100) {
  return throttle(scrollFunc, limit)
}

/**
 * Create a debounced resize handler
 * @param {Function} resizeFunc - Resize function to debounce
 * @param {number} delay - Delay in milliseconds (default: 250)
 * @returns {Function} - Debounced resize function
 */
export function createDebouncedResize(resizeFunc, delay = 250) {
  return debounce(resizeFunc, delay)
}

/**
 * Create a debounced input handler
 * @param {Function} inputFunc - Input function to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {Function} - Debounced input function
 */
export function createDebouncedInput(inputFunc, delay = 300) {
  return debounce(inputFunc, delay)
}

/**
 * Create a throttled API call function
 * @param {Function} apiFunc - API function to throttle
 * @param {number} limit - Time limit in milliseconds (default: 1000)
 * @returns {Function} - Throttled API function
 */
export function createThrottledApiCall(apiFunc, limit = 1000) {
  return throttle(apiFunc, limit)
}

/**
 * Utility to prevent rapid button clicks
 * @param {Function} clickHandler - Click handler function
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {Function} - Debounced click handler
 */
export function preventRapidClicks(clickHandler, delay = 500) {
  return debounce(clickHandler, delay, true)
}

/**
 * Create a debounced validation function
 * @param {Function} validationFunc - Validation function to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {Function} - Debounced validation function
 */
export function createDebouncedValidation(validationFunc, delay = 500) {
  return debounce(validationFunc, delay)
}

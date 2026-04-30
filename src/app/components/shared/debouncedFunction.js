import { useState, useEffect } from "react";

export default function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timerAction = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timerAction) 
    }, [value, delay])

    return debouncedValue
}
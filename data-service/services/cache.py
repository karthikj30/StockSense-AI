import time

_cache: dict[str, tuple[object, float]] = {}


def get_cached(key: str, ttl: int = 300):
    if key in _cache:
        data, timestamp = _cache[key]
        if time.time() - timestamp < ttl:
            return data
    return None


def set_cached(key: str, data: object):
    _cache[key] = (data, time.time())

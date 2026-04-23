
class PaymentMapper:

    PAYMONGO_MAP = {
        "gcash": "gcash",
        "maya": "paymaya",
        "card": "card"
    }

    INTERNAL_ONLY = {"cash", "qrph"}

    @classmethod
    def to_paymongo(cls, method: str) -> str:
        if method in cls.INTERNAL_ONLY:
            raise ValueError(f"{method} is not handled by PayMongo")

        try:
            return cls.PAYMONGO_MAP[method]
        except KeyError:
            raise ValueError(f"Unsupported payment method: {method}")


    @classmethod
    def is_paymongo(cls, method: str) -> bool:
        return method in cls.PAYMONGO_MAP


    @classmethod
    def is_internal(cls, method: str) -> bool:
        return method in cls.INTERNAL_ONLY
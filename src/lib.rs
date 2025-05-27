use serde::{Deserialize, Serialize};
use tsify::Tsify;
use wasm_bindgen::prelude::*;

#[derive(Tsify, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct Pair {
    one: i32,
    two: i32,
}

#[wasm_bindgen]
pub fn greet() -> String {
    String::from("Hello, omnis-wasm!")
}

#[wasm_bindgen]
pub fn create_pair(one: i32, two: i32) -> Pair {
    Pair { one, two }
}

#[wasm_bindgen]
pub fn add_pair(left: Pair, right: Pair) -> Pair {
    Pair {
        one: left.one + right.one,
        two: left.two + right.two
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use wasm_bindgen_test::*;

    #[wasm_bindgen_test]
    fn greet_says_hello() {
        let actual = greet().to_lowercase();
        assert!(actual.contains("hello"));
    }

    #[wasm_bindgen_test]
    fn test_create_pair() {
        let actual = create_pair(1, 2);
        assert_eq!(actual.one, 1);
        assert_eq!(actual.two, 2);
    }

    #[wasm_bindgen_test]
    fn test_add_pair() {
        let pair_a = Pair { one: 1, two: 2 };
        let pair_b = Pair { one: 2, two: 4 };
        let actual = add_pair(pair_a, pair_b);
        assert_eq!(actual.one, 3);
        assert_eq!(actual.two, 6);
    }
}
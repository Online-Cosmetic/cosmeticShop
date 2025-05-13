// export를 여러개 하려면 export {변수1, 변수2}
// 이때 import할때도 모양 맞춰서 :: import {변수1, 변수2} from 어쩌구
// 참고로 함수도 export 가능 :: ex ) 긴 modal 컴포넌트

let data = [
    {
        id : 0,
        title : "Glow Serum",
        content : "for Brightens skin",
        price : 45
    },
  
    {
        id : 1,
        title : "Matte Lipstick",
        content : "for Long-lasting",
        price : 20
    },
  
    {
        id : 2,
        title : "Boost Moisturizer",
        content : "for Deep hydration",
        price : 35
    },  

    {
        id : 3,
        title : "Brow Gel",
        content : "for Shapes brows",
        price : 18
    },
    
    {
        id : 4,
        title : "Eye Cream",
        content : "for Reduces puffiness",
        price : 30
    },

    {
        id : 5,
        title : "Night Cream",
        content : "for Nourishes skin",
        price : 55
    }
]

export default data;
import { Ref, onUnmounted, ref, watch } from "vue";

export function useDebounce(val:Ref,delay:number){
    const debounceVal=ref(val.value);
    let timer:NodeJS.Timeout|null=null;

    const stopWatch=watch(val,(newVal)=>{
        if(timer) clearTimeout(timer);
        timer=setTimeout(()=>debounceVal.value=newVal,delay);//重新开启一个定时器
    })
    onUnmounted(()=>stopWatch());//停止监听

    return debounceVal
}
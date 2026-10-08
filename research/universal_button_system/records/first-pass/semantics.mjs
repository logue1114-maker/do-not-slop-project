export const initialState=()=>({context:'web',revision:'after',webTab:'draft',appTab:'saved',format:'audio',starred:false,saveCount:0,pending:false,removed:false,beacons:3,signalCount:0,route:'ridge',menuOpen:false});
export function reduce(state,event){
 switch(event.type){
  case 'CONTEXT': return {...initialState(),context:event.value,revision:state.revision};
  case 'REVISION': return {...state,revision:event.value};
  case 'TAB': return {...state,[state.context==='web'?'webTab':'appTab']:event.value};
  case 'FORMAT': return {...state,format:event.value};
  case 'STAR': return {...state,starred:!state.starred};
  case 'SAVE_START': return state.pending||state.removed?state:{...state,pending:true};
  case 'SAVE_DONE': return state.pending?{...state,pending:false,saveCount:state.saveCount+1}:state;
  case 'REMOVE': return {...state,removed:true};
  case 'SIGNAL': return state.beacons>0?{...state,beacons:state.beacons-1,signalCount:state.signalCount+1}:state;
  case 'ROUTE': return {...state,route:event.value};
  case 'MENU': return {...state,menuOpen:!state.menuOpen};
  case 'RESET': return {...initialState(),context:state.context,revision:state.revision};
  default:return state;
 }
}
export function bindTabKeyboard(root,onSelect){
 const listener=event=>{
  const tab=event.target.closest('[role=tab]');if(!tab)return;
  const tabs=[...tab.parentElement.querySelectorAll('[role=tab]')];let index=tabs.indexOf(tab);
  if(event.key==='ArrowRight')index=(index+1)%tabs.length;else if(event.key==='ArrowLeft')index=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=tabs.length-1;else return;
  event.preventDefault();onSelect(tabs[index].dataset.tab);root.querySelector(`[data-tab="${tabs[index].dataset.tab}"]`)?.focus();
 };
 root.addEventListener('keydown',listener);return()=>root.removeEventListener('keydown',listener);
}

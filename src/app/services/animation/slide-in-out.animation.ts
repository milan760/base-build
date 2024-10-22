import { trigger, state, style, animate, transition  } from "@angular/animations";

export const slideInOutAnimation = trigger('slideInOut', [
    state('in', style({
        'max-width':'100%',
        'flex':'1 1 auto',
        'display':'block'
    })),
    state('out', style({
        'max-width':'0',
        'flex':'0 0 auto',
        'display':'none'
    })),
    transition('in => out',[
        animate('300ms ease-in-out')
    ]),
    transition('out => in',[
        animate('300ms ease-in-out')
    ])
]);
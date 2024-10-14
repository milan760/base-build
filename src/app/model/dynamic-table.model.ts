export class DynamicTable {
    isActive!: {
        searchDropdown: number,
        searchfield: number,
        showEntries: number,
        upperButtons: number,
        pagination: number,
        totalRecords: number,
        pageDescription: number
    }
    cardTitle!: string;
    pgSizeOptions!: Array<number>;
    selectedPageSize!: number;
    pageNumber!: number;
    totalRecords!: number;
    totalPages!: number;
    headerAndBodyLoopers!: Array<THeadObj>;
    secondHeaderRow!: Array<THeadObj>;
    upperButtons!: Array<{
        isActive: number,
        class: string,
        placement: string,
        title: string,
        icon: string,
        btnName: string
    }>;
    ActionButtons!: Array<{
        thRowspan: number,
        thColspan: number,
        tdRowspan: number,
        tdColspan: number,
        isTDactive: number,
        class: string,
        placement: string,
        title: string,
        icon: string,
        btnName: string
    }>;
    tBodyList!: Array<{ [key: string]: any }>;
    createNavigate!: string;
    editNavigate!: string;
}

export class THeadObj {
    thRowspan!: number;
    thColspan!: number;
    tdRowspan!: number;
    tdColspan!: number;
    isTHactive!: number;
    isTDactive!: number;
    THclass!: string;
    TDclass!: string
    spanClass!: string;
    isSortNeeded!: number;
    defaultIcon!: string;
    descIcon!: string;
    ascIcon!: string;
    THname!: string;
    TDkey!: string;
    TDdataType!: string;
}

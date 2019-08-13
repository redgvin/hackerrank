var s = 'aaaaaa'


class SuffixTree {
    s = '';
    pos = [];
    len = [];
    par = [];
    to = [];
    link = [{}]
    sz = 2;
    path = [];

    // need to count substrings
    sub = [];
    children = {};
    sLen = 0;
    max = 0;

    constructor(s) {
        this.s = s;
        this.sLen = this.max = s.length;

        this.len[1] = 1;
        this.pos[1] = 0;
        this.par[1] = 0;


        for (let i = s.length - 1; i >= 0; i--) {
            this.link[0][s[i]] = 1;
            this.extend(i);
        }

    }

    numberOfDifferentSubsting() {
        return this.len.reduce((acc, curr) => acc + curr, 0) - 1
    }

    maxOccurrenceMultipliedByLength () {
        let {par, children, to, pos, sub, len} = this;

        for (let i = par.length - 1; i > 0; i--) {
            if (!to[i]) {
                children[i] = 1
            }
        }

        for (let key in children) {
            this.check(Number(key))
        }

        for (let i = 1; i < par.length; i++) {
            let currentLength = 0;
            let point = i;

            while (point != 0 && par[point] != 0) {
                currentLength += len[point];
                point = par[point]
            }

            let res = sub[i] * currentLength

            if (res > this.max) {
                this.max = res;
            }
        }

        return this.max
    }

    check(i) {
        let {par, to, sub, pos, sLen} = this;
        let parIndex = par[i];

        if (parIndex == 1) return
        if (!to[i]) {
            if (pos[i] == sLen) {
                let p = sub[i] || 0;
                sub[i] = p + 1
            }

            for (let key in to[parIndex]) {
                if (to[parIndex][key] == i) {
                    let prev = sub[parIndex] || 0;
                    sub[parIndex] = prev + sub[i]

                    delete to[parIndex][key];
                    if (Object.keys(to[parIndex]).length == 0) {
                        delete to[parIndex];
                    }
                }
            }
            return this.check(par[i])
        }
    }

    attach(child, parent, c, child_len) {
        let {to, len, par} = this

        to[parent] = to[parent] || {}
        to[parent][c] = child;
        len[child] = child_len;
        par[child] = parent;
    }

    extend(i) {
        let v, vlen = s.length - i, old = this.sz - 1, pstk = 0;

        let {link, par, path, to, pos, len} = this;

        for (v = old, link[v] = link[v] || {}; !link[v][this.s[i]]; v = par[v], link[v] = link[v] || {}) {
            vlen -= len[v];
            path[pstk++] = v;
        }

        let w = link[v][this.s[i]];
        to[w] = to[w] || {}

        if (to[w][this.s[i + vlen]]) {
            let u = to[w][this.s[i + vlen]];
            for (pos[this.sz] = pos[u] - len[u]; this.s[pos[this.sz]] == this.s[i + vlen]; pos[this.sz] += len[v]) {
                v = path[--pstk];
                vlen += len[v];
            }
            this.attach(this.sz, w, this.s[pos[u] - len[u]], len[u] - (pos[u] - pos[this.sz]));
            this.attach(u, this.sz, this.s[pos[this.sz]], pos[u] - pos[this.sz]);

            w = link[v][this.s[i]] = this.sz++;
        }
        link[old][this.s[i]] = this.sz;
        this.attach(this.sz, w, this.s[i + vlen], this.s.length - (i + vlen));
        pos[this.sz++] = this.s.length;
    }
}

let a = new SuffixTree(s);
let diff = a.numberOfDifferentSubsting();
let max = a.maxOccurrenceMultipliedByLength();
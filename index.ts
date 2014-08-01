/// <reference path="typings/d3/d3.d.ts" />
/// <reference path="typings/vue/vue.0.10.5.d.ts" />

var m:number[] = [80, 80, 80, 80];
var w:number = 800 - m[1] - m[3];
var h:number = 400 - m[0] - m[2];

redraw([]);

function redraw(data: number[]){
    //Updateではなくもはや書きなおしてしまえ
    d3.select("svg").remove();

    // ----------------------------------------------------
    // 描画方法定義
    // ----------------------------------------------------
    // 0～wまでの値にdata[]内の値を割り当てる
    var xScale:D3.Scale.Scale = d3.scale.linear().domain([0, data.length]).range([0, w]);

    // 0～10までの値をh～0までに割り当てる。反転していることに注意！
    //var yScale:D3.Scale.Scale = d3.scale.linear().domain([0, 10]).range([h, 0]);
    // 下記のように書くと、最大値にあわせてスケールする。
    var yScale = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

    // 直線定義
    // data[] から x, y座標に変換する関数
    var line:D3.Svg.Line = d3.svg.line().x(function (d, i) {
        return xScale(i);
    }).y(function (d) {
        return yScale(d);
    });
    // 軸定義
    var xAxis:D3.Svg.Axis = d3.svg.axis().scale(xScale).tickSize(-h);
    var yAxisLeft:D3.Svg.Axis = d3.svg.axis().scale(yScale).ticks(4).orient("left");

    // ----------------------------------------------------
    // SVG要素の追加
    // ----------------------------------------------------
    var graph:D3.Selection = d3.select("#graph")
        .append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
    // 軸描画
    graph.append("svg:g").attr("class", "x axis").attr("transform", "translate(0," + h + ")").call(xAxis);
    graph.append("svg:g").attr("class", "y axis").attr("transform", "translate(-25,0)").call(yAxisLeft);

    //直線の描画
    //描画順の都合上、軸の描画よりも後に実行すること
    graph.append("svg:path").attr("d", line(data));
}

/**
 * CSVを評価して、チャートを再描画する
 * @param value
 */
function chartRedraw(value){
    var data:number[] = value.split(",").map(function(item){
        var trimed = item.trim();
        if(!isFinite(trimed) || trimed.length === 0){
            return 0;
        }
        return parseInt(trimed, 10);
    });
    redraw(data);
}

/**
 * Vue.jsバインディング
 * @type {Vue}
 */
var mainController = new Vue({
    el: '#main',
    data: {
        csv: '3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2'
    },
    method: {
    },
    ready: function(){
        //CSVの内容が変化したらチャートを書き直す
        this.$watch("csv", (value, mutation)=>{
            chartRedraw(value);
        });

        //初回描画
        chartRedraw(this.csv);
    }
});

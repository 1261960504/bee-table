import React from "react";

import {DicimalFormater} from "./utils";
export default function sum(Table,precision=2) {
  return class SumTable extends React.Component {
    //无状态
    constructor(props) {
      super(props);
      //array , tree
      this.tableType = "array";
    }


    getNodeItem =(array,newArray)=>{
      array.forEach((da,i)=>{
        if(da.children){
          this.getNodeItem(da.children,newArray);
        }else{
          newArray.push(da);
        }
      });
    }

    /**
     * 获取当前的表格类型。
     *
     */
    getTableType=()=>{
      const {columns} = this.props;
      let type = "array";
      columns.find((da,i)=>{
        if(da.children){
          type = "tree";
          return type;
        }
      })
      return type;
    }

	  toThousands(num) {
		  let result = '', counter = 0;
		  num = (num || 0).toString();
		  const numArr = num.split('.')
		  num = numArr[0]
		  for (var i = num.length - 1; i >= 0; i--) {
			  counter++;
			  result = num.charAt(i) + result;
			  if (!(counter % 3) && i != 0) { result = ',' + result; }
		  }
		  return numArr.length === 1 ? result : result +'.' +numArr[1];
	  }

    addSumData=()=>{
      let {data=[],columns=[]} = this.props;
      let sumdata = {},newColumns = [],newData = [];
      if (!Array.isArray(columns)) {console.log("columns type is error !");return;}
      let type = this.getTableType();
      if(type == 'tree'){
        this.getNodeItem(columns,newColumns);
      }else{
        newColumns = columns;
      }
      //返回一个新的数据
      newData = data.slice();
      newColumns.forEach((column,index)=>{
        sumdata[column.dataIndex] = "";
        if(column.sumCol){
          let count = 0;
          data.forEach((da,i)=>{

            let _num = parseFloat(da[column.key]);
            //排查字段值为NAN情况
            if(_num == _num){
              count += _num;
            }

          })
          let sum = DicimalFormater(count,precision);
          if(column.sumThousandth) {
			  sum = this.toThousands(sum)
		  }
          sumdata[column.dataIndex] = sum;
          if(column.sumRender&&typeof column.sumRender =='function'){
            sumdata[column.dataIndex] = column.sumRender(sum)
          }

        }
        if(index == 0){
          sumdata[column.dataIndex] = "合计 "+sumdata[column.dataIndex];
        }
      })

      newData.push(sumdata);
      return newData;
    }

    render() {
      return (
        <Table
          {...this.props}
          columns={this.props.columns}
          showSum={true}
          data={this.addSumData()}
        />
      );
    }
  };
}

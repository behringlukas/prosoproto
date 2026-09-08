import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
const sqlite=new DatabaseSync(':memory:');
sqlite.exec(readFileSync(new URL('../drizzle/0000_violet_ego.sql',import.meta.url),'utf8'));
const files=new Map();
export const env={
 DB:{
  prepare(sql){
   const query=sqlite.prepare(sql);
   return {bind(...args){return {async first(){return query.get(...args)||null},async run(){return query.run(...args)}}}};
  }
 },
 FILES:{
  async put(key,bytes,options){files.set(key,{bytes,options})},
  async get(key){const value=files.get(key);return value?{body:value.bytes}:null},
  async delete(key){files.delete(key)}
 }
};

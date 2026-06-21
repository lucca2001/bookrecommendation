/**
 * 数据访问层抽象（Data Source）
 * 严格对应 docs/08 交接文档：组件 / 路由不直接 import data/*，
 * 一律经由此层取数，便于后续从「文件内结构化数据」无缝切换到 Supabase。
 *
 * 现阶段（MVP）实现：直接返回 data/* 内的结构化数据（同步）。
 * 未来（Supabase）实现：把下列函数改为 async 查询 pgvector 即可，
 *   对调用方仅需把签名改成 Promise<...>（已统一返回 Promise，调用方用 await）。
 */
import type { Book, BookGrid, Question } from "@/types";
import { BOOKS } from "@/data/books";
import { BOOKGRIDS, BOOKGRID_BY_SLUG } from "@/data/bookgrids";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/data/questions";

/** 数据源接口：后续 Supabase 实现遵循同一契约 */
export interface DataSource {
  getQuestions(): Promise<Question[]>;
  getTotalQuestions(): Promise<number>;
  getBooks(): Promise<Book[]>;
  getBookById(id: string): Promise<Book | undefined>;
  getBookGrids(): Promise<BookGrid[]>;
  getBookGridBySlug(slug: string): Promise<BookGrid | undefined>;
}

/** MVP：基于 data/* 文件内数据的本地实现 */
class LocalDataSource implements DataSource {
  async getQuestions(): Promise<Question[]> {
    return QUESTIONS;
  }
  async getTotalQuestions(): Promise<number> {
    return TOTAL_QUESTIONS;
  }
  async getBooks(): Promise<Book[]> {
    return BOOKS;
  }
  async getBookById(id: string): Promise<Book | undefined> {
    return BOOKS.find((b) => b.bookId === id);
  }
  async getBookGrids(): Promise<BookGrid[]> {
    return BOOKGRIDS;
  }
  async getBookGridBySlug(slug: string): Promise<BookGrid | undefined> {
    return BOOKGRID_BY_SLUG[slug];
  }
}

/** 全局单例数据源。切换到 Supabase 时只需替换此处实现。 */
export const dataSource: DataSource = new LocalDataSource();

export interface productCategory {
  id: number;
  book_category_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface productImage {
  id: number;
  book_id: number;
  book_image: string;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export interface product {
  id: number;
  book_ISBN: string;
  book_author: string;
  book_category_id: number;
  book_description: string;
  book_name: string;
  book_price: number;
  book_published_year: number;
  book_publisher: string;
  book_weight: number;
  created_at: Date;
  updated_at: Date;
  bookCategory: productCategory;
  BookImage?: productImage[];
}

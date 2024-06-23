import { user } from './user.interface';

export interface warehouse {
  id: number;
  warehouse_name: string;
  warehouse_province: string;
  warehouse_city: string;
  warehouse_detail_loc: string;
  warehouse_latitude: string;
  warehouse_longitude: string;
  warehouse_admin_id: number;
  created_at: Date;
  updated_at: Date;
  user: user;
}

export interface listWarehouseInterface {
  id: number;
  warehouse_city: string;
  warehouse_name: string;
}

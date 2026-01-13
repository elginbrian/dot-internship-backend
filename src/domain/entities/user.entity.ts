export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
}

export enum Cabang {
  MALANG_KAWI = 'Malang Kawi',
  MADIUN = 'Madiun',
  KEDIRI = 'Kediri',
  MALANG_MARTADINATA = 'Malang Martadinata',
  LUMAJANG = 'Lumajang',
  MAGETAN = 'Magetan',
  NGANJUK = 'Nganjuk',
  BLITAR = 'Blitar',
  BANYUWANGI = 'Banyuwangi',
  BONDOWOSO = 'Bondowoso',
  JEMBER = 'Jember',
  PASURUAN = 'Pasuruan',
  PROBOLINGGO = 'Probolinggo',
  NGAWI = 'Ngawi',
  PONOROGO = 'Ponorogo',
  TULUNGAGUNG = 'Tulungagung',
  SITUBONDO = 'Situbondo',
  PACITAN = 'Pacitan',
  TRENGGALEK = 'Trenggalek',
  KCP_UNIVERSITAS_JEMBER = 'KCP Universitas Jember',
  PARE = 'Pare',
  KEPANJEN = 'Kepanjen',
  BATU = 'Batu',
  KCP_CARUBAN = 'KCP Caruban',
  KCP_UNIVERSITAS_BRAWIJAYA = 'KCP Universitas Brawijaya',
}

export enum Divisi {
  UNSECURED_LOAN = 'Unsecured Loan',
}

export interface User {
  id?: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  nip: string;
  divisi: Divisi;
  noHp: string;
  cabang: Cabang;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type Role = 'admin' | 'user'
export type CriterionType = 'benefit' | 'cost'

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}

export interface User {
  id: number
  name: string
  email: string
  role: Role
  created_at?: string
  updated_at?: string
}

export interface Kriteria {
  id: number
  nama: string
  bobot: number
  jenis: CriterionType
  keterangan: string | null
  created_at?: string
  updated_at?: string
}

export interface WeightSummary {
  total_bobot: number
  is_valid: boolean
  target: number
}

export interface Alternatif {
  id: number
  nama: string
  deskripsi: string | null
  foto: string | null
  foto_url?: string | null
  nilai_alternatif_count?: number
  created_at?: string
  updated_at?: string
}

export interface MatrixCell {
  id?: number
  nilai: number
}

export interface MatrixAlternative {
  id: number
  nama: string
  deskripsi: string | null
  foto_url?: string | null
  nilai: Record<number, MatrixCell>
}

export interface MatrixPayload {
  criteria: Kriteria[]
  alternatives: MatrixAlternative[]
  range: {
    min: number
    max: number
  }
}

export interface SawValue {
  kriteria_id: number
  kriteria_nama: string
  jenis: CriterionType
  bobot: number
  nilai: number
  nilai_normalisasi?: number
}

export interface SawMatrixRow {
  alternatif_id: number
  alternatif_nama: string
  values: SawValue[]
}

export interface RankingItem {
  alternatif_id: number
  alternatif_nama: string
  skor: number
  ranking: number
}

export interface SawResult {
  criteria: Kriteria[]
  step_1_matriks_keputusan: SawMatrixRow[]
  step_2_normalisasi: SawMatrixRow[]
  step_3_preferensi: RankingItem[]
  step_4_ranking: RankingItem[]
  ringkasan: {
    alternatif_terbaik?: RankingItem
    jumlah_kriteria: number
    jumlah_alternatif: number
  }
}

export interface PerhitunganDetail {
  id: number
  alternatif_id: number
  perhitungan_id: number
  skor: number
  ranking: number
  alternatif?: Alternatif
}

export interface Perhitungan {
  id: number
  nama_sesi: string
  user_id: number
  status: string
  hasil: SawResult
  user?: User
  details?: PerhitunganDetail[]
  created_at: string
  updated_at: string
}

export interface DashboardData {
  stats: {
    jumlah_kriteria: number
    jumlah_alternatif: number
    jumlah_perhitungan: number
  }
  hasil_terbaru: Perhitungan | null
  grafik_terbaru: RankingItem[]
  riwayat: Perhitungan[]
}

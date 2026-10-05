import { request } from '@/services/api';
import { LayoutBlock, LayoutCell, LayoutCellType, LayoutFixture } from '@/types/booking';
import { PageResponse } from '@/types/common';
import { Program, StudyCentre, StudyCentreFilters, StudyCentreLocation } from '@/types/studyCentre';

interface ProgramRef {
  programId: number;
  code: string;
  name: string;
}

interface StudyHallSummaryResponse {
  id: number;
  name: string;
  addressLine: string | null;
  city: string | null;
  state: string | null;
  pricePerDay: number;
  pricePerMonth: number | null;
  coverImageUrl: string | null;
  amenities: string[];
  programs: ProgramRef[];
  seatCount: number;
}

interface StudyHallDetailResponse {
  id: number;
  name: string;
  description: string | null;
  rules: string | null;
  addressLine: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  pricePerDay: number;
  pricePerMonth: number | null;
  images: { id: number; url: string; displayOrder: number; cover: boolean }[];
  amenities: { id: number; name: string }[];
  programs: ProgramRef[];
  operatingHours: { dayOfWeek: string; openTime: string | null; closeTime: string | null; closed: boolean }[];
  totalSeats: number;
}

interface AvailabilityResponse {
  totalSeats: number;
  availableSeats: number;
}

/** studyhall-service LayoutCellResponse — seat fields only on SEAT cells. */
interface LayoutCellResponse {
  row: number;
  column: number;
  type: LayoutCellType;
  label?: string;
  seatId?: number;
  seatNumber?: string;
  status?: 'AVAILABLE' | 'RESERVED' | 'MAINTENANCE' | 'INACTIVE';
  available?: boolean;
  pricePerDay?: number;
  pricePerMonth?: number | null;
}

/** studyhall-service FixtureResponse — an edge/centre fixture (AC), never a cell. */
interface FixtureResponse {
  id?: number;
  type: 'AC';
  position: LayoutFixture['position'];
  offset?: number | null;
  direction?: LayoutFixture['direction'];
  label?: string | null;
}

/** studyhall-service HallLayoutResponse (GET /api/studyhalls/{id}/layout). */
interface HallLayoutResponse {
  floors: {
    name: string | null;
    blocks: {
      id: number;
      name: string;
      layout: { rows: number; columns: number; cells: LayoutCellResponse[]; fixtures?: FixtureResponse[] } | null;
    }[];
  }[];
}

const SORT_PARAM: Record<NonNullable<StudyCentreFilters['sortBy']>, string | undefined> = {
  // newest first, so halls vendors just published appear at the top (the backend default is by name)
  recommended: 'createdAt,desc',
  priceLowToHigh: 'pricePerDay,asc',
  priceHighToLow: 'pricePerDay,desc',
};

function joinParts(parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(', ');
}

function toNullableNumber(value: number | null | undefined): number | null {
  return value == null ? null : Number(value);
}

function isOpen24x7(hours: StudyHallDetailResponse['operatingHours']): boolean {
  if (hours.length !== 7) return false;
  return hours.every(
    (day) =>
      !day.closed &&
      !!day.openTime?.startsWith('00:00') &&
      (!!day.closeTime?.startsWith('23:59') || !!day.closeTime?.startsWith('00:00'))
  );
}

function fromSummary(hall: StudyHallSummaryResponse): StudyCentre {
  return {
    id: String(hall.id),
    name: hall.name,
    location: joinParts([hall.addressLine, hall.city]),
    fullAddress: joinParts([hall.addressLine, hall.city, hall.state]),
    city: hall.city,
    description: null,
    rules: null,
    imageUrl: hall.coverImageUrl,
    pricePerDay: Number(hall.pricePerDay),
    pricePerMonth: toNullableNumber(hall.pricePerMonth),
    totalSeats: hall.seatCount,
    slotsLeft: null,
    isOpen24x7: false,
    amenities: hall.amenities,
    programs: hall.programs.map((program) => ({ id: program.programId, name: program.name })),
  };
}

function fromDetail(hall: StudyHallDetailResponse, availability: AvailabilityResponse | null): StudyCentre {
  const cover =
    hall.images.find((image) => image.cover) ?? [...hall.images].sort((a, b) => a.displayOrder - b.displayOrder)[0];
  return {
    id: String(hall.id),
    name: hall.name,
    location: joinParts([hall.addressLine, hall.city]),
    fullAddress: joinParts([hall.addressLine, hall.city, hall.state, hall.pincode]),
    city: hall.city,
    description: hall.description,
    rules: hall.rules,
    imageUrl: cover?.url ?? null,
    pricePerDay: Number(hall.pricePerDay),
    pricePerMonth: toNullableNumber(hall.pricePerMonth),
    totalSeats: hall.totalSeats,
    slotsLeft: availability ? availability.availableSeats : null,
    isOpen24x7: isOpen24x7(hall.operatingHours),
    amenities: hall.amenities.map((amenity) => amenity.name),
    programs: hall.programs.map((program) => ({ id: program.programId, name: program.name })),
  };
}

/** GET /api/studyhalls (public). */
export async function getStudyCentres(filters?: StudyCentreFilters): Promise<StudyCentre[]> {
  const page = await request<PageResponse<StudyHallSummaryResponse>>('/api/studyhalls', {
    auth: false,
    query: {
      search: filters?.query?.trim(),
      city: filters?.city,
      programId: filters?.programId,
      latitude: filters?.latitude,
      longitude: filters?.longitude,
      radiusKm: filters?.radiusKm,
      sort: SORT_PARAM[filters?.sortBy ?? 'recommended'],
      size: 100,
    },
  });
  return page.content.map(fromSummary);
}

/** GET /api/studyhalls/{id} + GET /api/studyhalls/{id}/availability (today). */
export async function getStudyCentreById(id: string): Promise<StudyCentre> {
  const [hall, availability] = await Promise.all([
    request<StudyHallDetailResponse>(`/api/studyhalls/${id}`, { auth: false }),
    request<AvailabilityResponse>(`/api/studyhalls/${id}/availability`, { auth: false }).catch(() => null),
  ]);
  return fromDetail(hall, availability);
}

/**
 * GET /api/studyhalls/{id}/layout?startDate=&endDate= — the vendor's exact grid per block
 * (seats, gaps, walkways, entrances). Seat availability for the dates is computed by the server;
 * a seat is selectable only when its status is AVAILABLE and `available` is true.
 */
export async function getSeatLayout(studyCentreId: string, startDate: string, endDate: string): Promise<LayoutBlock[]> {
  const layout = await request<HallLayoutResponse>(`/api/studyhalls/${studyCentreId}/layout`, {
    auth: false,
    query: { startDate, endDate },
  });
  return layout.floors.flatMap((floor) =>
    floor.blocks
      .filter((block) => block.layout && block.layout.rows > 0 && block.layout.columns > 0)
      .map<LayoutBlock>((block) => ({
        id: String(block.id),
        name: block.name,
        floorName: floor.name,
        rows: block.layout!.rows,
        columns: block.layout!.columns,
        fixtures: (block.layout!.fixtures ?? []).map<LayoutFixture>((fixture) => ({
          type: fixture.type,
          position: fixture.position,
          offset: fixture.offset ?? null,
          direction: fixture.direction ?? null,
          label: fixture.label ?? null,
        })),
        cells: block.layout!.cells.map<LayoutCell>((cell) => ({
          row: cell.row,
          column: cell.column,
          type: cell.type,
          label: cell.label ?? null,
          seat:
            cell.type === 'SEAT' && cell.seatId != null
              ? {
                  id: String(cell.seatId),
                  label: cell.seatNumber ?? '',
                  row: cell.row,
                  column: cell.column,
                  blockId: String(block.id),
                  blockName: block.name,
                  status: cell.status === 'AVAILABLE' && cell.available === true ? 'AVAILABLE' : 'OCCUPIED',
                  pricePerDay: Number(cell.pricePerDay ?? 0),
                  pricePerMonth: toNullableNumber(cell.pricePerMonth),
                }
              : null,
        })),
      }))
  );
}

/** GET /api/programs (public) — exams/courses. */
export async function getPrograms(): Promise<Program[]> {
  return request<Program[]>('/api/programs', { auth: false });
}

/** GET /api/studyhalls/locations (public) — cities that have live study halls. */
export async function getLocations(): Promise<StudyCentreLocation[]> {
  return request<StudyCentreLocation[]>('/api/studyhalls/locations', { auth: false });
}

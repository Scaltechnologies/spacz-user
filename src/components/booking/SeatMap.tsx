import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Seat } from '@/components/booking/Seat';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { LayoutBlock, LayoutCell, LayoutCellType, LayoutFixture, Seat as SeatType } from '@/types/booking';

interface SeatMapProps {
  block: LayoutBlock;
  onSeatPress: (seat: SeatType) => void;
}

const CELL_SIZE = 40;
const CELL_GAP = Spacing.xs;
const FIXTURE_CHIP = { width: 44, height: 20 };
const FIXTURE_BAND = 24;

/** Short labels for the vendor's non-seat features. EMPTY cells are drawn as gaps. */
const FEATURE_LABELS: Partial<Record<LayoutCellType, string>> = {
  ENTRANCE: 'In',
  EXIT: 'Exit',
  TABLE: 'Tbl',
  WALL: '',
  PILLAR: '',
  RECEPTION: 'Rcp',
  STAIRS: 'Str',
  LIFT: 'Lift',
  RESTROOM: 'WC',
  AC: 'AC',
  OTHER: '',
};

/**
 * Renders a block exactly as the vendor configured it: a rows × columns grid with seats, gaps and
 * features at their positions. Same orientation as the vendor app — the far side at the top and
 * row A (the entrance side) at the bottom. Fixtures (AC) are drawn on the block edges or its centre,
 * outside the grid, so they never take a seat's place.
 */
export function SeatMap({ block, onSeatPress }: SeatMapProps) {
  const byPosition = new Map(block.cells.map((cell) => [`${cell.row}:${cell.column}`, cell]));
  const rowsTopToBottom = Array.from({ length: block.rows }, (_, index) => block.rows - index);
  const columns = Array.from({ length: block.columns }, (_, index) => index + 1);

  const gridWidth = block.columns * CELL_SIZE + (block.columns - 1) * CELL_GAP;
  const gridHeight = block.rows * CELL_SIZE + (block.rows - 1) * CELL_GAP;
  const fixtures = block.fixtures ?? [];
  const onEdge = (position: LayoutFixture['position']) => fixtures.filter((fixture) => fixture.position === position);
  const north = onEdge('NORTH');
  const south = onEdge('SOUTH');
  const east = onEdge('EAST');
  const west = onEdge('WEST');
  const centre = onEdge('CENTER');

  /** Column-aligned fixtures sit along a horizontal band; no offset = centred on the band. */
  const horizontalLeft = (fixture: LayoutFixture) =>
    fixture.offset
      ? (fixture.offset - 1) * (CELL_SIZE + CELL_GAP) + (CELL_SIZE - FIXTURE_CHIP.width) / 2
      : (gridWidth - FIXTURE_CHIP.width) / 2;
  /** Row-aligned fixtures sit along a side band; rows are drawn far side first, so row r is at index rows - r. */
  const verticalTop = (fixture: LayoutFixture) =>
    fixture.offset
      ? (block.rows - fixture.offset) * (CELL_SIZE + CELL_GAP) + (CELL_SIZE - FIXTURE_CHIP.height) / 2
      : (gridHeight - FIXTURE_CHIP.height) / 2;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        {north.length > 0 && (
          <View style={[styles.band, { width: gridWidth }]}>
            {north.map((fixture, index) => (
              <FixtureChip key={`n${index}`} fixture={fixture} style={{ left: horizontalLeft(fixture), top: (FIXTURE_BAND - FIXTURE_CHIP.height) / 2 }} />
            ))}
          </View>
        )}

        <View style={styles.body}>
          {west.length > 0 && (
            <View style={[styles.side, { height: gridHeight }]}>
              {west.map((fixture, index) => (
                <FixtureChip key={`w${index}`} fixture={fixture} style={{ top: verticalTop(fixture), left: (FIXTURE_BAND - FIXTURE_CHIP.width) / 2 }} />
              ))}
            </View>
          )}

          <View>
            {rowsTopToBottom.map((row) => (
              <View key={row} style={styles.row}>
                {columns.map((column) => (
                  <Cell key={column} cell={byPosition.get(`${row}:${column}`)} onSeatPress={onSeatPress} />
                ))}
              </View>
            ))}
            {centre.length > 0 && (
              <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.centre]}>
                {centre.map((fixture, index) => (
                  <FixtureChip key={`c${index}`} fixture={fixture} style={null} />
                ))}
              </View>
            )}
          </View>

          {east.length > 0 && (
            <View style={[styles.side, { height: gridHeight }]}>
              {east.map((fixture, index) => (
                <FixtureChip key={`e${index}`} fixture={fixture} style={{ top: verticalTop(fixture), left: (FIXTURE_BAND - FIXTURE_CHIP.width) / 2 }} />
              ))}
            </View>
          )}
        </View>

        {south.length > 0 && (
          <View style={[styles.band, { width: gridWidth }]}>
            {south.map((fixture, index) => (
              <FixtureChip key={`s${index}`} fixture={fixture} style={{ left: horizontalLeft(fixture), top: (FIXTURE_BAND - FIXTURE_CHIP.height) / 2 }} />
            ))}
          </View>
        )}

        <View style={styles.entrance}>
          <Text style={styles.entranceLabel}>Entrance</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function FixtureChip({ fixture, style }: { fixture: LayoutFixture; style: object | null }) {
  const label = fixture.type === 'AC' ? 'AC' : fixture.type;
  return (
    <View
      accessibilityLabel={`${label} on the ${fixture.position.toLowerCase()} side`}
      style={[styles.chip, FIXTURE_CHIP_BOX, style ? { position: 'absolute' } : null, style ?? null]}>
      <Ionicons name="snow-outline" size={12} color={Colors.primary} />
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

function Cell({ cell, onSeatPress }: { cell?: LayoutCell; onSeatPress: (seat: SeatType) => void }) {
  if (!cell || cell.type === 'EMPTY') return <View style={styles.gap} />;
  if (cell.type === 'SEAT' && cell.seat) return <Seat seat={cell.seat} onPress={onSeatPress} />;
  if (cell.type === 'WALKWAY') return <View style={[styles.gap, styles.walkway]} />;
  return (
    <View style={[styles.gap, styles.feature]}>
      <Text style={styles.featureLabel} numberOfLines={1}>
        {cell.label?.slice(0, 4) || FEATURE_LABELS[cell.type] || ''}
      </Text>
    </View>
  );
}

const FIXTURE_CHIP_BOX = { width: FIXTURE_CHIP.width, height: FIXTURE_CHIP.height };

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    gap: CELL_GAP,
    alignItems: 'center',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    gap: CELL_GAP,
  },
  band: {
    height: FIXTURE_BAND,
    position: 'relative',
  },
  side: {
    width: FIXTURE_BAND,
    position: 'relative',
  },
  centre: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  chipLabel: {
    ...Typography.small,
    fontWeight: '700',
    color: Colors.primary,
  },
  gap: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  walkway: {
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
  },
  feature: {
    borderRadius: Radius.sm,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  entrance: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: Spacing.xxs,
    marginTop: Spacing.xxs,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
  },
  entranceLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
});

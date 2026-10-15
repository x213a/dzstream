import { FlatList, StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';
import type { Channel } from '@/types';

import { ChannelTile } from './ChannelTile';
import { SectionHeader } from './Screen';

interface CarouselProps {
  title: string;
  channels: Channel[];
  onSeeAll?: () => void;
  seeAllLabel?: string;
}

/** Rangée horizontale de cartes teintées, avec lien « Voir tout ». */
export function Carousel({ title, channels, onSeeAll, seeAllLabel }: CarouselProps) {
  if (channels.length === 0) return null;
  return (
    <View style={styles.section}>
      <SectionHeader title={title} onSeeAll={onSeeAll} seeAllLabel={seeAllLabel} />
      <FlatList
        horizontal
        data={channels}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => <ChannelTile channel={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={Separator}
        decelerationRate="fast"
        initialNumToRender={5}
        windowSize={5}
      />
    </View>
  );
}

const Separator = () => <View style={{ width: spacing.md }} />;

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  content: { paddingHorizontal: spacing.lg },
});

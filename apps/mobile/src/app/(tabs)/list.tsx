import { IMAGES } from "@/constants";
import {
  Header,
  ListCard,
  NewListSheet,
  ScreenContainer,
} from "@/features";
import { COLORS } from "@/theme";
import { useState } from "react";

export default function List() {
  const [sheetOpen, setSheetOpen] = useState(false);

  const [lists, setLists] = useState<
    { name: string; color: string }[]
  >([]);

  return (
    <ScreenContainer>
      <Header
        title="List"
        icon={IMAGES.plus}
        actionLabel="Add task"
        onActionPress={() => setSheetOpen(true)}
        iconStyle={{ tintColor: COLORS.Primary }}
        buttonStyle={{
          backgroundColor: COLORS.Surface,
          borderRadius: 12,
        }}
      />

      <ListCard
        title="Inbox"
        subtitle="12 tasks · 3 due today"
        initial="I"
        avatarColor={COLORS.PrimaryTint}
        initialColor={COLORS.Primary}
        containerStyle={{ marginTop: 16 }}
        onPress={() => console.log("Inbox pressed")}
      />

      {lists.map((list, index) => (
        <ListCard
          key={`${list.name}-${index}`}
          title={list.name}
          subtitle="0 tasks"
          initial={list.name.charAt(0).toUpperCase()}
          avatarColor={list.color}
          initialColor={COLORS.Primary}
          containerStyle={{ marginTop: 12 }}
          onPress={() => console.log(`${list.name} pressed`)}
        />
      ))}

      <NewListSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        existingNames={["Inbox", ...lists.map((list) => list.name)]}
        onCreate={(list) =>
          setLists((previous) => [...previous, list])
        }
      />
    </ScreenContainer>
  );
}
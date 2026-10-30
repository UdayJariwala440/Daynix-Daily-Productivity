import { Header, ListCard, NewListSheet, ScreenContainer } from "@/features";
import {
  createList,
  getListAll,
  listData,
} from "@/features/auth/services/listService";
import { useEffect, useState } from "react";
import { IMAGES } from "@/constants";
import { COLORS } from "@/theme";

interface SaveParams {
  id: string;
  name: string;
  color: string;
  subColor: string;
}
export default function List() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [lists, setLists] = useState<listData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<listData | null>(null);

  useEffect(() => {
    fetchlist();
  }, []);

  const fetchlist = async () => {
    setLoading(true);
    try {
      const response = await getListAll();
      if (response?.success === true && response?.data?.length !== 0) {
        setLists(response.data);
      }
    } catch (error) {
      console.log("Error ===>", JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  const save = async ({ id, name, color, subColor }: SaveParams) => {
    try {
      const sendData = {
        name: name,
        color: color,
        sub_color: subColor,
        ...(id ? { id } : {}),
      };
      const response = await createList(sendData);
      if (response.success === true) {
        setSelectedList(null)
        fetchlist();
      }
    } catch (error) {
      console.log("Error ====>", JSON.stringify(error));
    }
  };

  const handleEditList = (list: listData) => {
    setSelectedList(list);
    setSheetOpen(true);
  };

  return (
    <ScreenContainer>
      <Header
        rightIcon={IMAGES.plus}
        title="List"
        onRightPress={() => setSheetOpen(true)}
        rightIconStyle={{ tintColor: COLORS.Primary }}
        buttonStyle={{
          backgroundColor: COLORS.Surface,
          borderRadius: 12,
        }}
      />
      {lists.map((list, index) => (
        <ListCard
          key={`${list.name}-${index}`}
          title={list.name}
          subtitle="0 tasks"
          initial={list.name.charAt(0).toUpperCase()}
          avatarColor={list.sub_color}
          initialColor={list.color}
          containerStyle={{ marginTop: 12 }}
          onPress={() => console.log(`${list.name} pressed`)}
          onPressList={() => {
            handleEditList(list);
          }}
        />
      ))}
      <NewListSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        existingNames={["Inbox", ...lists.map((list) => list.name)]}
        onCreate={async (list) => {
          await save({
            id: "",
            name: list.name,
            color: list.color,
            subColor: list.subColor,
          });
        }}
        onUpdate={async (list) => {
          if (!selectedList) return;
          await save({
            id: selectedList.id,
            name: list.name,
            color: list.color,
            subColor: list.subColor,
          });
          setSelectedList(null);
        }}
        initialData={selectedList}
      />
    </ScreenContainer>
  );
}
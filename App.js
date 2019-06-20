import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Button
} from "react-native";
import { Constants, SQLite } from "expo";
import Items from "./Items/items";
import { styles } from "./Styles/styles";
import { db } from "./db/db";
import { controller } from "./db/controller";
// import { CreateAppNavigator } from "./Navigation/AppNavigator";

export default class App extends React.Component {
  state = {
    text: null
  };

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists items (id integer primary key not null, done int, value text);"
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>SQLite Example</Text>
        <View style={styles.flexRow}>
          <TextInput
            onChangeText={text => this.setState({ text })}
            onSubmitEditing={() => {
              this.add(this.state.text);
              this.setState({ text: null });
            }}
            placeholder="what do you need to do?"
            style={styles.input}
            value={this.state.text}
          />
        </View>
        <ScrollView style={styles.listArea}>
          <Items
            done={false}
            ref={todo => (this.todo = todo)}
            onPressItem={id =>
              db.transaction(
                tx => {
                  tx.executeSql(`update items set done = 1 where id = ?;`, [
                    id
                  ]);
                },
                null,
                this.update
              )
            }
          />
          <Items
            done={true}
            ref={done => (this.done = done)}
            onPressItem={id =>
              db.transaction(
                tx => {
                  tx.executeSql(`delete from items where id = ?;`, [id]);
                },
                null,
                this.update
              )
            }
          />
        </ScrollView>
        <Button title="Solid Button" onPress={this.handlePress} />
      </View>
    );
  }

  add(text) {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }

    db.transaction(
      tx => {
        tx.executeSql("insert into items (done, value) values (0, ?)", [text]);
        tx.executeSql("select * from items", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      this.update
    );
  }

  handlePress() {
    console.log("press");
    Alert.alert("press");
    controller.getData();
  }

  update = () => {
    this.todo && this.todo.update();
    this.done && this.done.update();
  };
}

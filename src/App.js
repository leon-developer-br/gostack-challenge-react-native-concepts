import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';

export default function App() {
  const [fetchedRepositories, setFetchedRepositories] = useState(false);
  const [repositories, setRepositories] = useState([]);
  
  useEffect(() => {
    fetchRepositories();
  }, []);
  
  async function fetchRepositories() {
    const { data: repositories } = await api.get('/repositories');
    setRepositories(repositories);
    setFetchedRepositories(true);
  }
  
  async function handleLikeRepository(id) {
    await api.post(`/repositories/${id}/like`);
    setRepositories(repositories.map(repository => {
      if(repository.id === id) repository.likes++;
      return repository;
    }))    
  }
  
  function NoRepositoriesMessage() {
    return (
      <>
        { (fetchedRepositories && !repositories.length) && 
          <View style={styles.noRepoContainer}> 
            <Text style={styles.noRepoText}> No repositories stored 😭️ </Text>
          </View>
        }
      </>
    );
  }
  
  function RepositoriesList() {
    return (
      <>
        { repositories.length > 0 && 
          <FlatList 
            data={repositories}
            keyExtractor={repository => repository.id}
            renderItem={({ item: repository }) => (
              <View style={styles.repositoryContainer} key={repository.id}>
                <Text style={styles.repository}>{repository.title}</Text>
                
                <View style={styles.techsContainer}>
                  { repository.techs.map(tech => (
                    <Text style={styles.tech} key={tech}> {tech} </Text>
                  ))}
                </View>

                <View style={styles.likesContainer}>
                  <Text style={styles.likeText} testID={`repository-likes-${repository.id}`}>
                    {repository.likes} { repository.likes < 2 ? 'curtida' : 'curtidas' }
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  activeOpacity={0.9}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        }
      </>
    )
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>        
        <NoRepositoriesMessage />
        <RepositoriesList />        
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  noRepoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRepoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'gold'
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
